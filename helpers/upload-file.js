const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, validExtension = ['jpg','png','jpeg','gif','pdf'], folder='') => {

    return new  Promise((resolve, reject) => {
        const {archivo} = files;
        const splitedName = archivo.name.split('.');
        const extension = splitedName [splitedName.length - 1];
    
        if (!validExtension.includes(extension)){
            return reject(
                `${extension} is not a valid extension. The file must be one of:${validExtension}`
            )    
        }
        const newName = uuidv4() + '.' + extension
        const uploadPath = path.join(__dirname, '../uploads/', folder, newName);
    
        archivo.mv(uploadPath, (err)=> {
          if (err) {
            return reject(err)
          }
          resolve(newName)
        });

    })
  
}


module.exports = {
    uploadFile
}