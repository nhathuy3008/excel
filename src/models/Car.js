const mongoose = require('mongoose');

// const carSchema = new mongoose.Schema({
//   plateNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   carType: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'CateCar',
//     required: true
//   },
//   repairContents: [
//     {
//       repairContent: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'RepairContent',
//         required: true
//       },
//       products: [
//         {
//           product: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Product',
//             required: true
//           },
//           quantity: {
//             type: Number,
//             required: true,
//             min: 1
//           },
//           statuses: [
//             {
//               type: mongoose.Schema.Types.ObjectId,
//               ref: 'Status'
//             }
//           ],
//           solutions: [
//             {
//               type: mongoose.Schema.Types.ObjectId,
//               ref: 'Solution'
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }, { timestamps: true });

// module.exports = mongoose.model('Car', carSchema); 
const carSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  carType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CateCar',
    required: true
  },
  repairContents: [
    {
      repairContent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RepairContent',
        required: true
      },
      servicePrice: {
        type: Number,
        default: 0 // Dùng cho "Công"
      },
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: {
            type: Number,
            required: true,
            min: 1
          },
          statuses: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Status'
            }
          ],
          solutions: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Solution'
            }
          ]
        }
      ]
    }
  ]
}, { timestamps: true });
module.exports = mongoose.model('Car', carSchema);