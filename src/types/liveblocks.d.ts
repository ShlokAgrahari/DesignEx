import "@liveblocks/node";

declare module "@liveblocks/node" {
  interface PrepareSessionOptions {
    userInfo: {
      name: string;
      email?: string;
      // Add any other custom user info properties you need
      [key: string]: any;
    };
  }
}