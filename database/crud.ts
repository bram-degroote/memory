import { getDatabase } from "./database";


export async function getScores() {
    const db = await getDatabase();
    const allRows = await db.getAllAsync<any>('SELECT * FROM scores');
    for (const row of allRows) {
        console.log(row.id, row.time, row.name);
        return allRows
    }
}
export async function createNewScore(time: number, name: string) {
    const db = await getDatabase()
    const statement = await db.prepareAsync(
        'INSERT INTO scores (time, name) VALUES ($time, $name)'
    )
    await statement.executeAsync({ $time: time, $name: name });

}

export async function resetScore() {
    const db = await getDatabase();
    db.execAsync("DELETE FROM scores;")
}