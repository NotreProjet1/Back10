// PublicationPModel.js
const db = require('../config/db');
const express = require('express');

const app = express();
const util = require('util');

const query = util.promisify(db.query).bind(db);

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const createPublication = async (publicationData, id_instructeur) => {
    const { titre, description, contenu } = publicationData;
    const date_creation = new Date(); // Obtenez la date et l'heure actuelles

    const insertQuery = `
        INSERT INTO publication (titre, description, contenu, id_instructeur, date_creation)
        VALUES (?, ?, ?, ?, ?)
    `;

    return await db.query(insertQuery, [titre, description, contenu, id_instructeur, date_creation]);
};
const createPublicationParticipant = async (publicationData, id_participant) => {
    const { titre, description, contenu } = publicationData;
    const date_creation = new Date(); // Obtenez la date et l'heure actuelles

    const insertQuery = `
        INSERT INTO publication (titre, description, contenu, id_participant, date_creation)
        VALUES (?, ?, ?, ?, ?)
    `;

    return await db.query(insertQuery, [titre, description, contenu, id_participant, date_creation]);
};
const getPublicationById = async (id_public) => {
    try {
        const results = await query('SELECT * FROM publication WHERE id_public = ?', [id_public]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};
const searchPublicationsByTitre = async (titre) => {
    try {
        const results = await query('SELECT * FROM publication WHERE titre = ? AND status = 1', [titre]);
        return results;
    } catch (error) {
        throw error;
    }
};



const getAllPublications = () => {
    const query = 'SELECT * FROM publication';
    return db.query(query);
};

const updatePublicationAdmin = (id_public, titre, description, contenu) => {
    const query = 'UPDATE publication SET titre = ?, description = ?, contenu = ? WHERE id_public = ?';
    return db.query(query, [titre, description, contenu, id_public]);
};
const updatePublicationInstructeur = (id_public, titre, description, contenu) => {
    const query = 'UPDATE publication SET titre = ?, description = ?, contenu = ? , status=2  WHERE id_public = ?';
    return db.query(query, [titre, description, contenu, id_public]);
};

const deletePublicationAdmin = (id_public) => {
    const query = 'DELETE FROM publication WHERE id_public = ?';
    return db.query(query, [id_public]);
};
const deletePublication = (id_public) => {
    const query = 'DELETE FROM publication WHERE id_public = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [id_public], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};


const updatePublicationtatus = async (id_public, status) => {
    try {
        const updateQuery = 'UPDATE publication SET status = ? WHERE id_public = ?';
        await db.query(updateQuery, [status, id_public]);
    } catch (error) {
        throw error;
    }
};
const getPublicationsByInstructorId = async (id_instructeur) => {
    const selectQuery = 'SELECT * FROM publication WHERE id_instructeur = ? AND status=1 ';
    return await query(selectQuery, [id_instructeur]);
};

module.exports = {
    getPublicationsByInstructorId ,
    updatePublicationtatus,
    createPublication,
    getAllPublications,
    updatePublicationAdmin,
    deletePublicationAdmin, deletePublication ,
    searchPublicationsByTitre,
    getPublicationById , updatePublicationInstructeur , createPublicationParticipant
};
