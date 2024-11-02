import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import connectMongoDb from '@/libs/mongodb';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        pseudo: { label: 'Pseudo', type: 'text' },
        password: { label: 'Password', type: 'password' },
        isUpdating: { label: 'isUpdating', type: 'text' },
      },
      async authorize(credentials) {
        const userPseudo = credentials.pseudo;
        const userPassword = credentials.password;
        const isUpdating = credentials.isUpdating;
        try {
          await connectMongoDb();

          const user = await User.findOne({ pseudo: userPseudo });
          if (!user) {
            console.log('Utilisateur non trouvé.');
            return null;
          }

          const isPasswordMatch = await bcrypt.compare(
            userPassword,
            user.password
          );
          if (isUpdating === 'false' && !isPasswordMatch) {
            console.log('Mot de passe incorrect.');
            return null;
          }

          return user;
        } catch (error) {
          console.log("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account) {
        account.userData = user;
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account && account.provider === 'credentials') {
        if (account.userData) {
          token.user = account.userData;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user || null;
        session.accessToken = token.accessToken || null;
      }

      return session;
    },
  },
  debug: true,
  session: {
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
