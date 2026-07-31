Unsorted

Unsorted thoughts - can be structured whenever

#### Time Tracking
- single tasks should be able to start time tracking
- BUT: one general issue, sometimes there are many tini tasks on the list, in those cases a general tracker would be better. Maybe something that works along the lines of pomo tracking
	- one problem here: what do i actually track during that time? should the timing be related to the tasks i 'finish' during that time, or should i activate an area for an unconnected focus session? 
- plan workblocks but with tasks that are not connected to the workblock? esp in programming i cannot always estimate how long something will take, so i plan my blocks but i still track my tasks thats always kind of a hassle
	- intelligent work phases? only works if subtasks have their own time.. idk in sunsama the workblock shifts to match the subtasks, but its annoying to always fill the workblocks with new subtasks, it would be better if tasks could 'group' together and i would also have the option to track 'general worktime' for when i'm doing stuff like emails etc that i dont want to track one by one, 


Design Explorations:
Use the claude_design MCP (https://api.anthropic.com/v1/design/mcp, auth via /design-login) to import this project:
https://claude.ai/design/p/8a763246-ab75-44de-ba87-ea90e9623033?file=Work+Sessions+Explorations.dc.html

Focus on these files (the whole project is readable):
- `Work Sessions Explorations.dc.html`

Also read these files the selection imports:
- `_ds/wren-design-system-dd9e3af3-cb06-4090-97be-43fc36685d2f/_ds_bundle.js`
- `_ds/wren-design-system-dd9e3af3-cb06-4090-97be-43fc36685d2f/base.css`
- `_ds/wren-design-system-dd9e3af3-cb06-4090-97be-43fc36685d2f/styles.css`
- `_ds/wren-design-system-dd9e3af3-cb06-4090-97be-43fc36685d2f/tokens/colors.css`
- `_ds/wren-design-system-dd9e3af3-cb06-4090-97be-43fc36685d2f/tokens/effects.css`
- `_ds/wren-design-system-dd9e3af3-cb06-4090-97be-43fc36685d2f/tokens/fonts.css`
- `_ds/wren-design-system-dd9e3af3-cb06-4090-97be-43fc36685d2f/tokens/spacing.css`
- `_ds/wren-design-system-dd9e3af3-cb06-4090-97be-43fc36685d2f/tokens/typography.css`
- `support.js`

Implement: `Work Sessions Explorations.dc.html`

#### Task Template
Space to create new tasks that can be 'pulled' into the active task list (see the dayplan-picnic.html) for an example
I could imagine that the main page has a sidebar like sunsama, where the user can switch between different views: 
- parked tasks
- task templates
- current projects
added value: they are not directly 'recurring tasks' but rather tasks that are done often, i'm not 100% how i will handle recurring task planning yet, this is a different topic but kinda related 
==possibilities==:
- user can either set a preference in the settings
- user starts with a decision:
	- start with template for eg 'wednesday' -> all recurring tasks for a wednesday are pulled, rest of the day is filled by the rules of energy/time 
	- day starts empty: user pulls relevant tasks into the day, switches in the sidebar between templates, recurring etc to put the day together themselves 
- at every time, the user can decide that they want to 'switch', maybe they used the pre-set day in the beginning but they want to clear the afternoon, maybe with a 'clear day' action, then they can fill the rest of the day, or maybe something like 'energy is lower than expected' action, that spreads the rest tasks of the day, maybe reducing the planned time for high energy tasks (needs finetuning)
- MVP for templates:
	- new subpage 'task templates'
	- user can add templates, edit them, work similiar to adding tasks 
	- pre requisite: #areas as templates should be grouped into their areas 
	- 'templates' are shown in the sidebar (pre requisite #sidebar)