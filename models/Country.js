const mongoose= require('mongoose')
const countrySchema =mongoose.Schema({
    countryName: {
        type: String,
        required: [true, "Country name is required"],
        trim: true,
        text: true,
      },
},
{
    timestamps: true,
  }
)

module.exports = mongoose.model('Country',countrySchema)