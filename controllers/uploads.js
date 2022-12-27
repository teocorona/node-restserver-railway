const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);


const loadFile = async (req = request, res = response) => {
    try {
        const fileName = await uploadFile(req.files, undefined, 'imgs')
        res.json({
            fileName
        })
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const updateFile = async (req = request, res = response) => {
    const { id, colection } = req.params;
    let model;
    switch (colection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            }
            break;
        case 'products':
            model = await Product.findById(id)
            if (!model) {
                return res.status(400).json({ msg: `No existe un producto con el id ${id}` })
            }
            break;
        default:
            return res.status(500).json({ msg: 'No hay respuesta para esta coleccion' })
    }
    try {
        if (model.img) {
            const pathFile = path.join(__dirname, '../uploads', colection, model.img)
            if (fs.existsSync(pathFile)) {
                fs.unlinkSync(pathFile)
            }
        }
    } catch (error) {

    }

    const fileName = await uploadFile(req.files, undefined, colection)
    model.img = fileName
    await model.save();
    res.json({
        id,
        colection
    })
}

const getFile = async (req = request, res = response) => {
    const { id, colection } = req.params;
    let model;
    switch (colection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            }
            break;
        case 'products':
            model = await Product.findById(id)
            if (!model) {
                return res.status(400).json({ msg: `No existe un producto con el id ${id}` })
            }
            break;
        default:
            return res.status(500).json({ msg: 'No hay respuesta para esta coleccion' })
    }
    try {
        if (model.img) {
            const pathFile = path.join(__dirname, '../uploads', colection, model.img)
            if (fs.existsSync(pathFile)) {
                return res.sendFile(pathFile)
            }
        }
        const placeholder = path.join(__dirname, '../assets/no-image.jpg')
        return res.sendFile(placeholder)
    } catch (error) {
    }
}

const updateFileCloudinary = async (req = request, res = response) => {
    const { id, colection } = req.params;
    let model;
    switch (colection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            }
            break;
        case 'products':
            model = await Product.findById(id)
            if (!model) {
                return res.status(400).json({ msg: `No existe un producto con el id ${id}` })
            }
            break;
        default:
            return res.status(500).json({ msg: 'No hay respuesta para esta coleccion' })
    }

    if (model.img) {
        const urlArr = model.img.split('/');
        const completeName = urlArr[urlArr.length - 1];
        const [public_id] = completeName.split('.');
        cloudinary.uploader.destroy(`RestServer/${colection}/${public_id}`)
    }
    const { tempFilePath } = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath,{folder:`RestServer/${colection}`})
    model.img = secure_url
    await model.save();
    res.json({
        model
    })
}


module.exports = {
    loadFile,
    updateFile,
    getFile,
    updateFileCloudinary
}