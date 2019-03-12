import fs from "fs-extra"
import readline from "readline"
import path from "path"

const DIR = path.resolve(__dirname,'../src/lib/js/classes')
const INDEX = DIR + '/' + 'index.js'
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

async function toWrite(className) {
	return(
`class ${className} {

}

export default ${className}`)
}

async function toWriteIndex(className) {
	return `import ${className} from './${className}.js'`
}

const readInput = (input) => {
	return new Promise((resolve) => {
		rl.question(`${input}: `, (answer) => {
			resolve(answer);
		})
	})
};

 function addToIndex() {
	 fs.readdir(DIR,(err,list) => {
		let rw = ""
		let toExport = []
		if(err)
			throw err
		list.splice(list.indexOf('index.js'),1)

		for(let cl in list) {
			let s = list[cl].slice(0,-3);
			rw += `import ${s} from './${s}.js'\n`
			toExport.push(s)
		}

		rw += '\nexport {' + toExport.join(', ') + '}\n'

		fs.truncate(INDEX)
		fs.outputFile(INDEX,rw)
	})
}

async function rw(file) {
	const check = (ew) => {
		let res = 0
		if(ew === 'o' || ew === 'y' || ew === 'oui' || ew === 'yes')
			res = 1
		else if(ew === 'n' || ew === 'no' || ew === 'non')
			res = 2

		return res;
	}

	let rw = String(await readInput("La classe existe déjà. Veux tu la supprimer(o) pour la réécrire(n) ? (o/n)"))
	rw.toLowerCase()
	let validRw = check(rw)

	while(validRw === 0) {
		console.warn("La saisie est erronée")
		rw = String(await readInput("Veux tu la supprimer(o) pour la réécrire(n) ? (o/n)"))
		validRw = check(rw)
	}

	if(validRw === 1)
		fs.truncate(file)
	else
		process.exit()
}

async function run() {
	console.log("Création d'une classe de fichier.")
	let className = await readInput("Donnons lui un nom")
	if (!className || className === '' || className.trim() === '' || className.indexOf(' ') !== -1) {
		throw new Error('erreur: élément je t\'ai dit donne juste un nom sans espace');
	}

	let file = DIR + '/' + className + ".js"

	let tw = await toWrite(className)

	await fs.pathExists(file, async (err,exists) => {
		if(err)
			throw err

		if(exists)
			await rw(file)
		rl.close()
		fs.outputFile(file,tw)
		addToIndex()
		console.clear()
		console.info(`classe ${className} créée`)
	})
}

run().catch(error => {
	console.log(error)
	process.exit();
})