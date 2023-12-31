# Bookord

https://bookord.web.app/

Real-time chat application.

It was built with Vite, Authentication, Database, and hosting provided by Firebase.

## Running the project

You're going to need to make a Firebase account and set up Authentication, Firestore Database, Storage and optionally Hosting.

<img src="https://i.ibb.co/nkdfhYs/image.png" alt="firebase-config">

After that, you can update your Firebase config in FirebaseContext.tsx.

<img src="https://i.ibb.co/RYj5cPb/image.png" alt="firebase-config">

## Features/TODOS
Currently available features:

- authentication system that allows creating new users (later on added ability to log in as anonymous)

- realtime chat

- separate channels

- ability to create new chat channels

- admin, moderator, chatter role system

- user list (I'm not sure if it's possible to display only online users using Firestore)

- ability to moderate channels (remove messages, remove channels)

- private channels (online invited users or moderators can see it)
  
- avatar system

- some responsiveness (it's a bit buggy atm, still working on it)

- ability to change channel settings (name, members of the channel, privacy level) and an option to delete channel

- user profiles


TODO:

- user moderation (banning/deleting users and retroactively deleting or hiding messages sent by that user)

- private message system

- going to have to learn how to cache images

- user settings system

- continuing on making the styling better and making the site more responsive

<p align="center">
  <img src="https://i.ibb.co/Nr2dSNp/image.png" alt="bookord-preview">
</p>

