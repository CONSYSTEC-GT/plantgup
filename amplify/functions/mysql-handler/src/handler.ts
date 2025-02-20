import { env } from '$amplify/env/mysql-handler'; // Importar el objeto env generado
import mysql from 'mysql2/promise';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Crear un pool de conexiones para mejorar el rendimiento
const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD, // Acceder al secreto
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Ajusta según tus necesidades
});

// Encabezados CORS para permitir solicitudes desde el frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // O especifica un dominio
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener una conexión del pool

    // Determina la operación basada en el método HTTP y la ruta
    const { httpMethod, path, queryStringParameters, body } = event;

    // Manejar solicitudes GET
    if (httpMethod === 'GET') {
      const [rows] = await connection.query('SELECT * FROM tabla LIMIT 100');
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(rows),
      };
    }

    // Manejar solicitudes POST
    if (httpMethod === 'POST') {
      if (!body) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Body is required for POST requests' }),
        };
      }

      let data;
      try {
        data = JSON.parse(body); // Validar que el body es un JSON válido
      } catch (error) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Invalid JSON format in body' }),
        };
      }

      // Usar consultas preparadas para evitar inyección SQL
      const [result] = await connection.execute(
        'INSERT INTO tabla (campo1, campo2) VALUES (?, ?)',
        [data.campo1, data.campo2]
      );

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify(result),
      };
    }

    // Si el método HTTP no es soportado
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unsupported operation' }),
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        type: error instanceof Error ? error.name : 'Unknown',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      }),
    };
  } finally {
    if (connection) connection.release(); // Liberar la conexión al pool
  }
};