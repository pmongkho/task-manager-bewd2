import { readFile, writeFile } from 'fs/promises'
import readline from 'readline'

const tasksFilePath = './tasks.json'

//read tasks from tasks.json
async function getAllTasks() {
	const data = await readFile(tasksFilePath, 'utf8', (err, result) => {
		if (err) throw new Error('Error reading file!', err)
	})

	try {
		return JSON.parse(data)
	} catch (parseErr) {
		throw new Error('Error parsing JSON file!')
	}
}

//list all tasks
async function listTasks() {
		await getAllTasks().then((tasks) => {
			if (tasks.length === 0) {
				console.log('No tasks found!')
			} else {
				console.log('Tasks:\n')
				tasks.map((task, i) => {
					console.log(
						`${i + 1}.\n title: ${task.title}\n description: ${
							task.description
						}\n status: ${task.status}\n`
					)
				})
			}

		}).catch((err) => {
			throw new Error('Error getting tasks!',err)
		})	
}

//add a new task
async function addTask(title, description) {
	await getAllTasks().then((tasks) => {
		tasks.push({title, description, status: 'not completed'})
		return tasks
	}).then(async(newTasks) => {
		await writeFile(
		tasksFilePath,
		JSON.stringify(newTasks),
		'utf8',
		(err, result) => {
			if (err) throw new Error('Error adding task!', error)
			else console.log('Task added successfully.', result)
		}
	)
	}).catch((err) => {
		throw new Error('Error getting tasks!',err)
	})
	
	
}

//mark a task as completed
async function completeTask(title) {
	await getAllTasks().then((tasks) => {
		const taskToUpdate = tasks.find((task) => task.title === title)
		taskToUpdate.status = 'completed'
		return tasks
	}).then(async (newTasks) => {
		await writeFile(
			tasksFilePath,
			JSON.stringify(newTasks),
			'utf8',
			(err, result) => {
				if (err) throw new Error('Error completing task!', err)
				else console.log('Task marked as completed.')
			}
		)
	}).catch((err) => {
		throw new Error('Task not found!',err)
	})
}

// Create a simple command-line interface
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

function startCLI() {
	console.log('Task Manager CLI')
	console.log('Options:')
	console.log('1: List tasks')
	console.log('2: Add a task')
	console.log('3: Mark a task as completed')
	console.log('4: Exit\n')

	rl.question('Enter an Option: ', async (command) => {
		switch (command) {
			case '1':
				await listTasks()
				startCLI()
				break
			case '2':
				const title = await askQuestion('Enter task title: ')
				const description = await askQuestion('Enter task description: ')
				await addTask(title, description)
				startCLI()
				break
			case '3':
				const taskTitle = await askQuestion(
					'Enter task title to mark as completed: '
				)
				await completeTask(taskTitle)
				startCLI()
				break
			case '4':
				rl.close()
				break
			default:
				console.log('Invalid option!')
				startCLI()
				break
		}
	})
}

// Helperask a question and return the user's input
function askQuestion(question) {
	return new Promise((resolve) => {
		rl.question(question, resolve)
	})
}

// Start the CLI
startCLI()
