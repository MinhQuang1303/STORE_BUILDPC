const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pc-builder').then(async () => {
    const SP = require('./src/models/SanPham');
    const DM = require('./src/models/DanhMuc');
    console.log('SanPham:', await SP.countDocuments());
    console.log('DanhMuc:', await DM.countDocuments());
    const sp = await SP.findOne().populate('idDanhMuc');
    console.log('Mau:', JSON.stringify(sp, null, 2));
    process.exit(0);
});
