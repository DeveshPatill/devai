"use client";

import { authClient } from "@/lib/auth-client"; //import the auth client

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const { data: session} = authClient.useSession() 


  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email, 
      name,
      password, // user password -> min 8 characters by default 

    }, {
      onError: () => {
        window.alert("Somenthing went wrong");
      },
      onSuccess: () => {
        window.alert("Success")
      },
    });
  }

  const onLogin = () => {
    authClient.signIn.email({
      email, 
      password, // user password -> min 8 characters by default
    }, {
      onError: () => {
        window.alert("Somenthing went wrong");
      },
      onSuccess: () => {
        window.alert("Success")
      }
    });
  }

  if (session) {
  return (
    <div className="flex flex-col p-4 gap-y-4">
        <p className="text-lg font-semibold">
          Logged in as {session.user.name}
        </p>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => authClient.signOut()}
        >
          Sign Out
        </Button>
    </div>
  );
}


  return (
    <div className="p-4 flex flex-col gap-y-4">
      {/* <form 
      className="flex flex-col gap-4 max-w-md mx-auto mt-10"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    > */}
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" onClick={onSubmit}>
          Create User
        </Button>
      {/* </form> */}


      {/* <form 
      className="flex flex-col gap-4 max-w-md mx-auto mt-10"
      onSubmit={(e) => {
        e.preventDefault();
        onLogin();
      }}
    > */}
        {/* <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}

      <div className="p-4 flex flex-col gap-y-4">
        <Input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" onClick={onLogin}>
          Login
        </Button>
        
      </div>
        

      {/* </form> */}

    </div>
  );
}

