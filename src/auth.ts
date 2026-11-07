import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getDatabase } from "@/lib/db/mongodb";

export const SUPER_ADMIN_EMAIL = "david.artavia.rodriguez@gmail.com";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.AUTH_SECRET || "e4d2a1b9c87f6543210fedcba9876543210fedcba9876543210fedcba9876543",
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const email = user.email.toLowerCase().trim();
      const isSuperAdmin = email === SUPER_ADMIN_EMAIL.toLowerCase();

      try {
        const db = await getDatabase();
        const usersCollection = db.collection("usuarios");

        const existingUser = await usersCollection.findOne({ email });

        if (!existingUser) {
          // Registrar nuevo usuario en la collection 'usuarios'
          // Nuevo usuario siempre entra desactivado, salvo david.artavia.rodriguez@gmail.com
          await usersCollection.insertOne({
            nombre: user.name || "Usuario Registrado",
            email: email,
            imagen: user.image || "",
            rol: isSuperAdmin ? "administrador" : "visitante",
            activo: isSuperAdmin ? true : false,
            creadoEn: new Date().toISOString(),
            ultimoIngreso: new Date().toISOString(),
          });
        } else {
          // Actualizar datos de sesión y preservar rol/estado salvo super admin
          await usersCollection.updateOne(
            { email },
            {
              $set: {
                ultimoIngreso: new Date().toISOString(),
                ...(user.image ? { imagen: user.image } : {}),
                ...(user.name ? { nombre: user.name } : {}),
                ...(isSuperAdmin ? { rol: "administrador", activo: true } : {}),
              },
            }
          );
        }
        return true;
      } catch (error) {
        console.error("[AUTH SIGNIN ERROR]:", error);
        // Permitir el inicio de sesión si falla temporalmente la conexión, para no bloquear
        return true;
      }
    },

    async jwt({ token, user }) {
      const email = (user?.email || token?.email)?.toLowerCase()?.trim();
      if (email) {
        try {
          const db = await getDatabase();
          const usersCollection = db.collection("usuarios");
          const dbUser = await usersCollection.findOne({ email });

          if (dbUser) {
            token.rol = dbUser.rol || (email === SUPER_ADMIN_EMAIL.toLowerCase() ? "administrador" : "visitante");
            token.activo = typeof dbUser.activo === "boolean" ? dbUser.activo : (email === SUPER_ADMIN_EMAIL.toLowerCase());
            token.nombre = dbUser.nombre || token.name;
            token.imagen = dbUser.imagen || token.picture;
          } else if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
            token.rol = "administrador";
            token.activo = true;
          } else {
            token.rol = "visitante";
            token.activo = false;
          }
        } catch (error) {
          console.error("[AUTH JWT ERROR]:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        // Asignar rol y estado al objeto de sesión del usuario
        (session.user as unknown as { rol?: string; activo?: boolean }).rol =
          (token.rol as string) || "visitante";
        (session.user as unknown as { rol?: string; activo?: boolean }).activo =
          (token.activo as boolean) ?? false;

        if (token.nombre) {
          session.user.name = token.nombre as string;
        }
        if (token.imagen) {
          session.user.image = token.imagen as string;
        }
      }
      return session;
    },
  },
});
