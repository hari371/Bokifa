const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const pool = require('../src/config/db')
const assetsDirectory = path.resolve(__dirname, '../../assests')

const authorNames = [
	'James Wilson',
	'Sarah Mitchell',
	'Robert Bennett',
	'Emily Carter',
	'Michael Brooks',
	'Olivia Parker',
	'Daniel Foster',
	'Sophia Turner',
]

const bookTitles = [
	'The Silent Library',
	'Beyond the Horizon',
	'A World of Stories',
	'The Art of Reading',
	'Echoes of Yesterday',
	'The Last Chapter',
	'Letters to Tomorrow',
	'The Hidden Garden',
	'A Journey Within',
	'Shadows and Light',
	'The Forgotten Path',
	'Whispers of Time',
	'Dreams of Tomorrow',
	'The Golden Pages',
	'Across the Ocean',
	'An Open Window',
	'The Secret Keeper',
	'A Thousand Words',
	'The Other Side',
	'Under the Stars',
	'The Paper Kingdom',
	'Fragments of Life',
	'The Endless Road',
	'A Place to Begin',
	'The Book of Wonders',
	'When Stories Begin',
]

const blogTitles = [
	'Why Reading Still Matters',
	'How to Build a Reading Habit',
	'Discovering New Authors',
	'Books That Inspire Creativity',
	'Creating Your Perfect Reading Space',
	'The Joy of Collecting Books',
	'Finding Your Next Great Read',
]

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

function getImages(folder) {
	const directory = path.join(assetsDirectory, folder)

	if (!fs.existsSync(directory)) {
		return []
	}

	return fs.readdirSync(directory)
		.filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function getImagePath(folder, images, index) {
	const image = images[index]

	return image ? `/assests/${folder}/${image}` : null
}

async function getRows(procedure) {
	const [result] = await pool.query(`CALL ${procedure}()`)
	return result[0] || []
}

async function seedAuthors() {
	const existing = await getRows('GetAuthors')

	if (existing.length > 0) {
		console.log('Authors already exist; skipping author seeding.')
		return existing
	}

	const images = getImages('authors')

	for (let i = 0; i < authorNames.length; i++) {
		await pool.query('CALL AddAuthor(?, ?, ?)', [
			authorNames[i],
			`Sample author profile for ${authorNames[i]}.`,
			getImagePath('authors', images, i),
		])
	}

	return getRows('GetAuthors')
}

async function seedBooks(authors) {
	const existing = await getRows('GetBooks')

	if (existing.length > 0) {
		console.log('Books already exist; skipping book seeding.')
		return
	}

	const images = getImages('books')

	for (let i = 0; i < bookTitles.length; i++) {
		const author = authors[i % authors.length]

		await pool.query('CALL AddBook(?, ?, ?, ?, ?)', [
			bookTitles[i],
			`Sample description for ${bookTitles[i]}.`,
			199 + i * 20,
			getImagePath('books', images, i),
			author.id,
		])
	}
}

async function seedBlogs(authors) {
	const existing = await getRows('GetBlogs')

	if (existing.length > 0) {
		console.log('Blogs already exist; skipping blog seeding.')
		return
	}

	const images = getImages('blogs')

	for (let i = 0; i < blogTitles.length; i++) {
		const author = authors[i % authors.length]

		await pool.query('CALL AddBlog(?, ?, ?, ?)', [
			blogTitles[i],
			`Sample blog description for ${blogTitles[i]}.`,
			getImagePath('blogs', images, i),
			author.id,
		])
	}
}

async function seed() {
	try {
		const authors = await seedAuthors()

		if (authors.length === 0) {
			throw new Error('No authors are available for book and blog seeding.')
		}

		await seedBooks(authors)
		await seedBlogs(authors)

		console.log('Bokifa database seeding completed successfully.')
		console.log('Missing images are supported; records can use NULL image paths.')
	} catch (error) {
		console.error('Seeding failed:', error.message)
		process.exitCode = 1
	} finally {
		await pool.end()
	}
}

seed()
