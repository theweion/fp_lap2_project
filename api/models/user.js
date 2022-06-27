//
// ─── CLASS: USERS ───────────────────────────────────────────────────────────────
//
// DESCRIPTION: Construct User class with properties and methods.
//
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── GLOBALS ────────────────────────────────────────────────────────────────────
//

const db = require('../dbconfig/init');
let timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

// ────────────────────────────────────────────────────────────────────────────────

module.exports = class User{
	constructor(data) {
		this.id = data.id;
		this.username = data.username;
		this.password = data.password;
		this.email = data.email;
		this.created_at = timestamp;
	};
	
	static get all(){
		return new Promise (async (resolve, reject) => {
			try {
				const userData = await db.query(`SELECT id FROM users`);
				let users = userData.rows.map(user => new User(user));
				resolve(users);
			} catch (err) {
				reject('User not found!');
			};
		});
	};

	static getById(id){
		return new Promise (async (resolve, reject) => {
			try {
				const userData = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
				let user = new User(userData.rows[0]);
				resolve(user);
			} catch (err) {
				reject('User not found!');
			};
		});
	};

	static async create(username, password, email){
		return new Promise (async (resolve, reject) => {
			try {
				const userData = await db.query(`INSERT INTO users (username, password, email, timestamp) VALUES ($1, $2, $3, $4) RETURNING *`, [username, password, email, timestamp]);
				let user = new User(userData.rows[0]);
				resolve(user);
			} catch (err) {
				reject('User not created!');
			};
		});
	};

	destroy(){
		return new Promise (async (resolve, reject) => {
			try {
				const userData = await db.query(`DELETE FROM users WHERE id = $1`, [this.id]);
				resolve('User deleted!');
			} catch (err) {
				reject('User not deleted!');
			};
		});
	}
};