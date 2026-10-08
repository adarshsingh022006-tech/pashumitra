const express = require('express');
const router = express.Router();
const { z } = require('zod');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const animalSchema = z.object({
  name_or_tag: z.string().min(1),
  species: z.enum(['cow', 'buffalo', 'goat', 'sheep', 'pig', 'poultry']),
  age: z.number().min(0.1).max(35).default(2.0),
  sex: z.enum(['female', 'male']).default('female'),
  breed: z.string().optional(),
  vaccination_status: z.enum(['Vaccinated', 'Unvaccinated', 'Partially Vaccinated']).default('Vaccinated')
});

// GET /api/animals
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = db('animals')
      .leftJoin('users', 'animals.user_id', 'users.id')
      .select(
        'animals.*',
        'users.name as owner_name',
        'users.village as owner_village',
        'users.phone as owner_phone'
      )
      .orderBy('animals.id', 'desc');

    // If farmer, only show their own animals
    if (req.user.role === 'farmer') {
      query = query.where('animals.user_id', req.user.id);
    }

    const animals = await query;
    res.json({ animals });
  } catch (err) {
    console.error('[Animals GET Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve animals' });
  }
});

// POST /api/animals
router.post('/', authenticateToken, async (req, res) => {
  try {
    const validated = animalSchema.parse(req.body);

    const [animalId] = await db('animals').insert({
      user_id: req.user.id,
      name_or_tag: validated.name_or_tag,
      species: validated.species,
      age: validated.age,
      sex: validated.sex,
      breed: validated.breed || null,
      vaccination_status: validated.vaccination_status
    }).returning('id');

    const id = typeof animalId === 'object' ? animalId.id : animalId;
    const animal = await db('animals').where('id', id).first();

    res.status(201).json({ animal });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0]?.message || 'Validation failed' });
    }
    console.error('[Animals POST Error]:', err);
    res.status(500).json({ error: 'Failed to add animal' });
  }
});

// GET /api/animals/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const animal = await db('animals')
      .leftJoin('users', 'animals.user_id', 'users.id')
      .select('animals.*', 'users.name as owner_name', 'users.phone as owner_phone', 'users.village as owner_village')
      .where('animals.id', req.params.id)
      .first();

    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    const reports = await db('health_reports')
      .where('animal_id', req.params.id)
      .orderBy('created_at', 'desc');

    res.json({ animal, reports });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch animal details' });
  }
});

module.exports = router;
