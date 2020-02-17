#! /usr/bin/env node

const [,, ...args] = process.argv

if(args[0]==="-a"){
	console.log(`${args}`)
}

console.log("end")
