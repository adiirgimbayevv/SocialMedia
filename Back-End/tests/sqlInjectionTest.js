const db = require('../config/db');

async function testSqlInjection() {
  console.log(' Тесты на SQL-инъекцию (PostgreSQL)...\n');

  const badInputs = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "' UNION SELECT * FROM users --",
    "1; SELECT pg_sleep(5); --"
  ];

  for (const input of badInputs) {
    try {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [input]);
      console.log(`"${input}" — безопасно (найдено ${result.rows.length} записей)`);
    } catch (err) {
      console.log(` Ошибка: ${err.message}`);
    }
  }
  console.log('\n PostgreSQL + параметризация защищает от SQL-инъекций!');
}

testSqlInjection();