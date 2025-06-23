# What is Overlink?
Overlink is a web-based cybersecurity simulation game where players navigate a terminal interface to infiltrate networks, bypass security systems, and complete strategic hacking missions. It is currently in a very early stage of development, with updates and new features added frequently.

## Instructions
To start the backend,
  * Navigate to the `backend` folder
  * Type `npm run dev`

To start the frontend,
  * Navigate to the `frontend` folder
  * Type `npm run dev`

## Gameplay
### Missions
<img width="817" alt="image" src="https://github.com/user-attachments/assets/1bc8dff0-8b2e-4924-ba86-19f78dbc2603" />

The missions menu can be accessed in the top navigation menu. It contains a list of all available jobs for you to do. The more missions you successfully complete, the higher your skill rating will be. Higher paying missions require a higher skill level, but are more complex with a higher risk of detection.

### Map
<img width="1067" alt="image" src="https://github.com/user-attachments/assets/7dbb71b2-2793-4a19-8d2a-2a79f4c90163" />

The map can also be accessed in the navigation menu. It displays all known devices available for you to connect to. Nodes with a dashed border are devices you have access to at least one account on, while a solid border indicates admin access. Green nodes represent devices that are involved in a mission you are currently on. Route your connection through more nodes in order to delay detection - but make sure to clear your logs!

### Login
<img width="390" alt="image" src="https://github.com/user-attachments/assets/3fbf6e6b-b0c4-4870-ac27-66db83a304fd" />

Upon connecting to an endpoint that you do not yet have access to, you will be presented with a login screen. You will need to find the correct username and password in order to access the system.

<img width="390" src="https://github.com/user-attachments/assets/bf514776-e7a2-4ead-83a1-7b54249b88cd" />

Use the Password Breaker (and additional software for more complex systems) to obtain credentials and gain access to the system. Click on the `Code` input field to start the Password Breaker.

### Terminal
<img width="343" alt="image" src="https://github.com/user-attachments/assets/5202e880-d694-4307-8bee-f017ba3d7892" />

Once a connection is established, you will be presented with a list of folders that currently exist on that device. Click on a folder name to see the files that it contains.

<img width="546" alt="image" src="https://github.com/user-attachments/assets/e67d47b3-e0e0-46d9-beeb-94cb05935016" />

You will then be able to view and interact with (copy, delete, etc) the files in the folder you selected. 

## Planned Features
Some of the upcoming features currently in development include (but aren't limited to):
* Tutorial mission to illustrate gameplay for first time users
* More missions and mission types
* Store to upgrade and purchase new software
* Continue to fix bugs, address edge cases, and polish existing game mechanics
