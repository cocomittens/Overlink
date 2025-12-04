# What is Overlink?
Overlink is an Uplink inspired web-based cybersecurity simulation game with modernized QoL features. It is currently in a very early stage of development, with updates and new features added frequently.

## Running the Game
To start the backend,
  * Navigate to the `backend` folder
  * Type `npm run dev`

To start the frontend,
  * Navigate to the `frontend` folder
  * Type `npm run dev`

## Gameplay
### Missions
<img width="1312" height="763" alt="image" src="https://github.com/user-attachments/assets/5853525a-ed57-4762-8a5c-cd751abb0067" />

The missions menu can be accessed in the top navigation menu. It contains a list of all available jobs for you to do. The more missions you successfully complete, the higher your skill rating will be. Higher paying missions require a higher skill level, but are more complex with a higher risk of detection.

### Map
<img width="1312" height="765" alt="image" src="https://github.com/user-attachments/assets/f810c160-67c0-4509-8952-5298a6df23e0" />

The map can also be accessed in the navigation menu. It displays all known devices available for you to connect to. Nodes with a dashed border are devices you have access to at least one account on, while a solid border indicates admin access. Green nodes represent devices that are involved in a mission you are currently on. Route your connection through more nodes in order to delay detection - but make sure to clear your logs!

### Login
<img width="1312" height="762" alt="image" src="https://github.com/user-attachments/assets/9bd5570c-34bc-469a-8854-6dfc25b042c1" />

Upon connecting to an endpoint that you do not yet have access to, you will be presented with a login screen. You will need to find the correct username and password in order to access the system.

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
