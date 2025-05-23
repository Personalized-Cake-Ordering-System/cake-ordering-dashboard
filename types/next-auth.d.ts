import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  
  interface Session {
    user: {
      id: string ;
      email: string ;
      role: string ;
      name: string ;
      phone:string ;
      gender:string ;
      wallet_id: string ;
      wallet: {
        balance: number ;
      } ;
      entity : {
        id: string ;
      }
      avatarUrl: string ;
      roleId: number ;
      access_token: string ;
      refresh_token: string ;
      emailVerified?: Date | null ;
    } ;
  }
}
