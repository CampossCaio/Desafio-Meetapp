import multer from 'multer';
import { resolve, extname } from 'path';
import crypto from 'crypto';


export default {
  storage: multer.diskStorage({

    // Caminho para onde o arquivo será enviado
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),

    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // Gera alguns caracteres aleatórios
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },


  }),
};
