import {array_cs_k, array_kt_truc} from "./projectionConst";

function convert_LatLon_UTMWGS84(lat, lon, lonOfOrigin, scaleFactor){
    let lat_geo = lat * Math.PI / 180;
    let lon_geo = lon * Math.PI / 180;
    let latOfOrigin = 0;
//        lonOfOrigin = 105; //Kinh tuyến trục múi 48; thay các giá trị khác nhau cho các múi chiếu 49 (kinh tuyến trục là 111) và múi 50 (kinh tuyến trục là 117)
    let easting = 500000;
    let northing = 0;
//        scaleFactor = 0.9996;  //múi 6 độ có scaleFactor (hệ số K) = 0.9996
    let Pi = Math.PI;
    let aElipsoid = 6378137;
    let fElipsoid = 298.25722356;
    let eElipsoid = 0.00669437999020854;
    let eeElipsoid = 0.00673949674234457;
//Công thức tính
    let isK = eElipsoid / 4;
    let isM = 3 * (Math.pow(eElipsoid, 2)) / 64;
    let isN = 5 * (Math.pow(eElipsoid, 3)) / 256;
    let isO = 3 * eElipsoid / 8;
    let isP = 3 * (Math.pow(eElipsoid, 2)) / 32;
    let isQ = 45 * (Math.pow(eElipsoid, 3)) / 1024;
    let isR = 15 * (Math.pow(eElipsoid, 2)) / 256;
    let isT = 45 * (Math.pow(eElipsoid, 3)) / 1024;
    let isV = 35 * (Math.pow(eElipsoid, 3)) / 3072;

    let calA = ((lon_geo) - (lonOfOrigin * Pi / 180)) * Math.cos(lat_geo);
    let calT = Math.pow(Math.tan(lat_geo * Pi / 180), 2);
    let calV = aElipsoid / Math.pow((1 - eElipsoid * Math.pow(Math.sin(lat_geo), 2)), 0.5);
    let calC = (eElipsoid) * (Math.pow(Math.cos(lat_geo), 2)) / (1 - eElipsoid);

    let calM = aElipsoid * ((1 - isK - isM - isN) * (lat_geo) - (isO + isP + isQ) * Math.sin(2 * (lat_geo)) + (isR + isT) * Math.sin(4 * (lat_geo)) - isV * Math.sin(6 * (lat_geo)));
    let calMO = aElipsoid * ((1 - isK - isM - isN) * latOfOrigin - (isO + isP + isQ) * Math.sin(2 * latOfOrigin) + (isR + isT) * Math.sin(4 * latOfOrigin) - isV * Math.sin(6 * latOfOrigin));

    //Tọa độ cần tìm
    let x_utm = easting + scaleFactor * calV * (calA + ((1 - calT + calC) * (Math.pow(calA, 3)) / 6) + ((5 - 18 * calT + (Math.pow(calT, 2)) + 72 * calC - 58 * eeElipsoid) * (Math.pow(calA, 5)) / 120));  //tọa độ mét
    let y_utm = northing + scaleFactor * (calM - calMO + (calV * Math.tan((lat_geo)) * ((((Math.pow(calA, 2)) / 2) + (5 - calT + 9 * calC + 4 * Math.pow(calC, 2)) * (Math.pow(calA, 4)) / 24) + ((61 - 58 * calT + Math.pow(calT, 2) + 600 * calC - 330 * eeElipsoid) * (Math.pow(calA, 6)) / 720))));  //tọa độ mét
    let point = {
        lat: x_utm,
        long: y_utm
    };
    return point;
};

function convert_LatLon_VN2000(lat, lon, lonOfOrigin, scaleFactor){
    //Công thức 1: Chuyển từ hệ Lat/Lon sang hệ UTM WGS 84  múi 6 độ
    //  Khai báo biến
    let lat_geo = lat * Math.PI / 180;
    let lon_geo = lon * Math.PI / 180;
    let latOfOrigin = 0;
    let easting = 500000;
    let northing = 0;
    let Pi = Math.PI;
    let aElipsoid = 6378137;
    let fElipsoid = 298.25722356;
    let eElipsoid = 0.00669437999020854;
    let eeElipsoid = 0.00673949674234457;
    //Công thức tính
    let isK = eElipsoid / 4;
    let isM = 3 * (Math.pow(eElipsoid, 2)) / 64;
    let isN = 5 * (Math.pow(eElipsoid, 3)) / 256;
    let isO = 3 * eElipsoid / 8;
    let isP = 3 * (Math.pow(eElipsoid, 2)) / 32;
    let isQ = 45 * (Math.pow(eElipsoid, 3)) / 1024;
    let isR = 15 * (Math.pow(eElipsoid, 2)) / 256;
    let isT = 45 * (Math.pow(eElipsoid, 3)) / 1024;
    let isV = 35 * (Math.pow(eElipsoid, 3)) / 3072;
//
//        double calA = ((lon_geo) - (lonOfOrigin * Pi / 180)) * cos(lat_geo);
//        double calT = pow(tan(lat_geo * Pi / 180), 2);
//        double calV = aElipsoid / pow((1 - eElipsoid * pow(sin(lat_geo), 2)), 0.5);
//        double calC = (eElipsoid) * (pow(cos(lat_geo), 2)) / (1 - eElipsoid);
//
//        double calM = aElipsoid * ((1 - isK - isM - isN) * (lat_geo) - (isO + isP + isQ) * sin(2 * (lat_geo)) + (isR + isT) * sin(4 * (lat_geo)) - isV * sin(6 * (lat_geo)));
//        double calMO = aElipsoid * ((1 - isK - isM - isN) * latOfOrigin - (isO + isP + isQ) * sin(2 * latOfOrigin) + (isR + isT) * sin(4 * latOfOrigin) - isV * sin(6 * latOfOrigin));
//
//        //Tọa độ cần tìm
//        double x_utm = easting + scaleFactor * calV * (calA + ((1 - calT + calC) * (pow(calA, 3)) / 6) + ((5 - 18 * calT + (pow(calT, 2)) + 72 * calC - 58 * eeElipsoid) * (pow(calA, 5)) / 120));  //tọa độ mét
//        double y_utm = northing + scaleFactor * (calM - calMO + (calV * tan((lat_geo)) * ((((pow(calA, 2)) / 2) + (5 - calT + 9 * calC + 4 * pow(calC, 2)) * (pow(calA, 4)) / 24) + ((61 - 58 * calT + pow(calT, 2) + 600 * calC - 330 * eeElipsoid) * (pow(calA, 6)) / 720))));  //tọa độ mét
////Công thức 2. Chuyển từ hệ tọa độ UTM WGS 84 sang hệ UTM VN2000 múi 6 độ và 3 độ
////2.1. Module 1. Chuyển hệ tọa độ UTM sang hệ tọa độ địa lý (Lat/lon)
//        //khai báo biến
//        double x = x_utm;
//        double y = y_utm;
//        //Công thức tính
//        double calUtmGeo1 = (1 - pow((1 - eElipsoid), 0.5)) / (1 + pow((1 - eElipsoid), 0.5));
//        double calUtmGeo2 = 0;
//        double calUtmGeo3 = calUtmGeo2 + (y - northing) / scaleFactor;
//        double calUtmGeo4 = calUtmGeo3 / (aElipsoid * (1 - (eElipsoid / 4) - 3 * (pow((eElipsoid), 2) / 64) - 5 * (pow((eElipsoid), 3) / 256)));
//        double calUtmGeo5 = calUtmGeo4 + ((3 * calUtmGeo1 / 2) - 27 * (pow(calUtmGeo1, 3)) / 32) * sin(2 * calUtmGeo4) + (21 * (pow(calUtmGeo1, 2)) / 16 - 55 * (pow(calUtmGeo1, 2)) / 32) * sin(4 * calUtmGeo4) + (151 * (pow(calUtmGeo1, 3)) / 96) * sin(6 * calUtmGeo4) + (1097 * (pow(calUtmGeo1, 4)) / 512) * sin(8 * calUtmGeo4);
//        double calUtmGeo6 = pow(tan(calUtmGeo5), 2);
//        double calUtmGeo7 = aElipsoid / pow((1 - eElipsoid * pow((sin(calUtmGeo5)), 2)), 0.5);
//        double calUtmGeo8 = aElipsoid * (1 - eElipsoid) / pow((1 - eElipsoid * pow((sin(calUtmGeo5)), 2)), 1.5);
//        double calUtmGeo9 = eeElipsoid * pow((cos(calUtmGeo5)), 2);
//        double calUtmGeo10 = (x - easting) / (scaleFactor * calUtmGeo7);
//        double lat_utm = calUtmGeo5 - (calUtmGeo7 * (tan(calUtmGeo5)) / calUtmGeo8) * ((pow(calUtmGeo10, 2)) / 2 - (5 + 3 * calUtmGeo6 + 10 * calUtmGeo9 - 4 * (pow(calUtmGeo9, 2)) - 9 * eeElipsoid) * (pow(calUtmGeo10, 4)) / 24 + (61 + 90 * calUtmGeo6 + 298 * calUtmGeo9 + 45 * (pow(calUtmGeo6, 2)) - 252 * eeElipsoid - 3 * pow(calUtmGeo9, 2)) * (pow(calUtmGeo10, 6)) / 720);
//        double lon_utm = lonOfOrigin * PI / 180 + (calUtmGeo10 - (1 + 2 * calUtmGeo6 + calUtmGeo9) * (pow(calUtmGeo10, 3)) / 6 + (5 - 2 * calUtmGeo9 + 28 * calUtmGeo6 - 3 * (pow(calUtmGeo9, 2)) + 8 * eeElipsoid + 24 * pow(calUtmGeo6, 2)) * (pow(calUtmGeo10, 5)) / 120) / cos(calUtmGeo5);
    //2.2. Module 2. Chuyển từ hệ tọa độ địa lý sang hệ tọa độ địa tâm
    //Khai báo biến
//        double m2lat = lat_utm;
//        double m2lon = lon_utm;
    let m2lat = lat_geo;
    let m2lon = lon_geo;
    let height = 0;
    //Công thức tính
    let m2v = aElipsoid / Math.pow((1 - eElipsoid * (Math.sin(m2lat)) * (Math.sin(m2lat))), 0.5);
    let m2x = (m2v + height) * (Math.cos(m2lat)) * (Math.cos(m2lon));
    let m2y = (m2v + height) * (Math.cos(m2lat)) * (Math.sin(m2lon));
    let m2z = ((1 - eElipsoid) * m2v + height) * Math.sin(m2lat);
// 2.3. Module 3. Chuyển hệ tọa độ UTM WGS 84 sang hệ tọa độ UTM VN2000 sử dụng 7 tham số của Bộ TN và MT
    //Khai báo biến
    let x1 = m2x;
    let y1 = m2y;
    let z1 = m2z;
    let DELTA_X = 191.90441429;
    let DELTA_Y = 39.30318279;
    let DELTA_Z = 111.4503283;
    let ROT_X = 0.00928836;
    let ROT_Y = -0.01975479;
    let ROT_Z = 0.00427372;
    let SCALE = -0.000000252906277;
    //Công thức tính
    let x2 = DELTA_X + ((1 + SCALE) * (x1 + (y1 * ((ROT_Z / 3600) * Pi / 180)) - (z1 * (ROT_Y / 3600) * Pi / 180)));
    let y2 = DELTA_Y + ((1 + SCALE) * (-(ROT_Z / 3600) * Pi / 180) + y1 + (z1 * (ROT_X / 3600) * Pi / 180));
    //(Thêm bước chuyển x2, y2 từ radian sang degrees)
    let z2 = DELTA_Z + ((1 + SCALE) * ((x1 * (ROT_Y / 3600) * Pi / 180)) - (y1 * (ROT_X / 3600) * Pi / 180) + z1);
//2.4. Module 4. Chuyển từ hệ tọa độ địa tâm sang hệ tọa độ địa lý
    // khai báo biến
    let x3 = x2;
    let y3 = y2;
    let z3 = z2;
    let bElipsoid = 6356752.31424496;
    //Công thức tính
    let v1 = m2v;
    let p = Math.pow(((Math.pow(x3, 2)) + (Math.pow(y3, 2))), 0.5);
    let phi = Math.atan((z3 * aElipsoid) / (p * bElipsoid));
    let lat1 = Math.atan((z3 + eeElipsoid * bElipsoid * (Math.pow(Math.sin(phi), 3))) / (p - eElipsoid * aElipsoid * (Math.pow(Math.cos(phi), 3))));
    let lon1 = (Math.atan(y3 / x3));
    let height1 = (p / (Math.cos(lat1))) - v1;
//2.5. Module 5. Chuyển từ hệ tọa độ địa lý sang hệ phẳng (UTM)
    //Khai báo biến
    let lat2 = lat1;
    let lon2;
    if (lon1 >= 0) {
        lon2 = lon1;
    } else {
        lon2 = Pi + lon1;
    }
    //múi 6 độ chọn scaleFactor = 0.9996 và múi 3 độ chọn scaleFactor = 0.9999
    //Công thức tính
    let m5calA = (lon2 - (lonOfOrigin * Pi / 180)) * Math.cos(lat2);
    let m5calT = Math.pow(Math.tan(lat2), 2);
    let m5calV = aElipsoid / Math.pow((1 - eElipsoid * Math.pow(Math.sin(lat2), 2)), 0.5);
    let m5calC = (eElipsoid) * (Math.pow(Math.cos(lat2), 2)) / (1 - eElipsoid);
    let m5calM = aElipsoid * ((1 - isK - isM - isN) * lat2 - (isO + isP + isQ) * Math.sin(2 * lat2) + (isR + isT) * Math.sin(4 * lat2) - isV * Math.sin(6 * lat2));
    let m5calMO = aElipsoid * ((1 - isK - isM - isN) * latOfOrigin - (isO + isP + isQ) * Math.sin(2 * latOfOrigin) + (isR + isT) * Math.sin(4 * latOfOrigin) - isV * Math.sin(6 * latOfOrigin));
    //Tọa độ điểm (VN 2000)
    let x4 = easting + scaleFactor * m5calV * (m5calA + ((1 - m5calT + m5calC) * (Math.pow(m5calA, 3)) / 6) + ((5 - 18 * m5calT + (Math.pow(m5calT, 2)) + 72 * m5calC - 58 * eeElipsoid) * (Math.pow(m5calA, 5)) / 120));  //tọa độ mét
    let y4 = northing + scaleFactor * (m5calM - m5calMO + (m5calV * Math.tan(lat2) * ((((Math.pow(m5calA, 2)) / 2) + (5 - m5calT + 9 * m5calC + 4 * Math.pow(m5calC, 2)) * (Math.pow(m5calA, 4)) / 24) + ((61 - 58 * m5calT + Math.pow(m5calT, 2) + 600 * m5calC - 330 * eeElipsoid) * (Math.pow(m5calA, 6)) / 720))));  //tọa độ mét
    //Tọa độ điểm sau khi chuyển là x4 và y4
    let point = {
        lat: x4,
        long: y4
    }
    return point;
};


const transformLatLng = (lat, lng, projection) =>{
    let latLngTranform;
    let lonOfOrigin = array_kt_truc[projection];
    let scaleFactor = array_cs_k[projection];
    let fomular = 2;
    if (projection <= 2) {
        fomular = 1;
    }
    switch (fomular) {
        case 1:
            latLngTranform = convert_LatLon_UTMWGS84(lat, lng, lonOfOrigin, scaleFactor);
            break;
        case 2:
            latLngTranform = convert_LatLon_VN2000(lat, lng, lonOfOrigin, scaleFactor);
            break;
        default:
            latLngTranform = convert_LatLon_UTMWGS84(lat, lng, 105, 0.9996);
            break;
    }
    return latLngTranform;
}

const transformLatLngExport = (lat, lng, lonOfOrigin, scaleFactor, fomular) => {
    let latLngTranform;
    switch (fomular) {
        case 1:
            latLngTranform = convert_LatLon_UTMWGS84(lat, lng, lonOfOrigin, scaleFactor);
            break;
        case 2:
            latLngTranform = convert_LatLon_VN2000(lat, lng, lonOfOrigin, scaleFactor);
            break;
        default:
            latLngTranform = convert_LatLon_UTMWGS84(lat, lng, 105, 0.9996);
            break;
    }
    return latLngTranform;
};

export {
    convert_LatLon_UTMWGS84, convert_LatLon_VN2000, transformLatLngExport, transformLatLng
}


