import { Matrix, Vector } from "./matrix.js";

// create a 4x4 matrix to the perspective projection / view matrix
function mat4x4Perspective(prp, srp, vup, clip) {
    // 1. translate PRP to origin
    let T_PRP = new Matrix(4, 4);
    T_PRP.values = [[1, 0, 0, prp.values[0] * -1], 
                    [0, 1, 0, prp.values[1] * -1], 
                    [0, 0, 1, prp.values[2] * -1], 
                    [0, 0, 0, 1]];
    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
    let n = prp.subtract(srp);
    n.normalize();
    let u = vup.cross(n);;
    u.normalize();
    let v = n.cross(u);
    let R = new Matrix(4, 4);
    R.values = [[u.values[0][0], u.values[1][0], u.values[2][0], 0],
                [v.values[0][0], v.values[1][0], v.values[2][0], 0], 
                [n.values[0][0], n.values[1][0], n.values[2][0], 0],
                [0, 0, 0, 1]];
    // 3. shear such that CW is on the z-axis
    let DOP = new Vector(3);
    DOP.values = [(clip[0] + clip[1]) / 2, (clip[2] + clip[3]) / 2, -clip[4]];
    let SH_par = new Matrix(4, 4);
    SH_par.values = [[1, 0, -DOP.values[0][0] / DOP.values[2][0], 0],
                     [0, 1, -DOP.values[1][0] / DOP.values[2][0], 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
    //console.log(SH_par);
    // 4. scale such that view volume bounds are ([z,-z], [z,-z], [-1,zmin])
    let S_per = new Matrix(4, 4);
    let s = [(2 * clip[4]) / ((clip[1] - clip[0]) * clip[5]), (2 * clip[4]) / ((clip[3] - clip[2]) * clip[5]), 1 / clip[5]];
    S_per.values = [[s[0], 0, 0, 0],
                    [0, s[1], 0, 0],
                    [0, 0, s[2], 0],
                    [0, 0, 0, 1]];

    let transform = Matrix.multiply([S_per, SH_par, R, T_PRP]);
    return transform;
}

// create a 4x4 matrix to project a perspective image on the z=-1 plane //START HERE
function mat4x4MPer() { //DONE
    let mper = new Matrix(4, 4);

    //creating mper matrix -- this is always the same.
    mper.values =  [[1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, -1, 0]];
    return mper;
}

// create a 4x4 matrix to translate/scale projected vertices to the viewport (window) //START HERE
function mat4x4Viewport(width, height) { //check to see if this is right
    let viewport = new Matrix(4, 4);

    viewport.values =  [[width / 2, 0, 0, width / 2],
                        [0, height / 2, 0, height / 2],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]];

    return viewport;
}


///////////////////////////////////////////////////////////////////////////////////
// 4x4 Transform Matrices                                                         //
///////////////////////////////////////////////////////////////////////////////////

// set values of existing 4x4 matrix to the identity matrix
function mat4x4Identity(mat4x4) {
    mat4x4.values = [[1, 0, 0, 0],
                     [0, 1, 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
    return mat4x4;
}

// set values of existing 4x4 matrix to the translate matrix 
function mat4x4Translate(mat4x4, tx, ty, tz) { //DONE
    mat4x4.values = [[1, 0, 0, tx],
                     [0, 1, 0, ty],
                     [0, 0, 1, tz],
                     [0, 0, 0, 1]];
    return mat4x4;
}

// set values of existing 4x4 matrix to the scale matrix
function mat4x4Scale(mat4x4, sx, sy, sz) { //DONE
    mat4x4.values = [[sx, 0, 0, 0],
                     [0, sy, 0, 0],
                     [0, 0, sz, 0],
                     [0, 0, 0, 1]];
    return mat4x4;
}

// set values of existing 4x4 matrix to the rotate about x-axis matrix
function mat4x4RotateX(mat4x4, theta) { //DONE
    mat4x4.values = [[1, 0, 0, 0],
                     [0, Math.cos(theta), -Math.sin(theta), 0],
                     [0, Math.sin(theta), Math.cos(theta), 0],
                     [0, 0, 0, 1]];
    return mat4x4;
}

// set values of existing 4x4 matrix to the rotate about y-axis matrix
function mat4x4RotateY(mat4x4, theta) { //DONE
    mat4x4.values = [[Math.cos(theta), 0, Math.sin(theta), 0],
                     [0, 1, 0, 0],
                     [-Math.sin(theta), 0, Math.cos(theta), 0],
                     [0, 0, 0, 1]];

    return mat4x4;
}

// set values of existing 4x4 matrix to the rotate about z-axis matrix
function mat4x4RotateZ(mat4x4, theta) { //DONE
    mat4x4.values = [[Math.cos(theta),-Math.sin(theta), 0, 0],
                     [Math.sin(theta), Math.cos(theta), 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
    return mat4x4;
}

// set values of existing 4x4 matrix to the shear parallel to the xy-plane matrix
function mat4x4ShearXY(mat4x4, shx, shy) { //DONE
    mat4x4.values = [[1,0, shx, 0],
                     [0, 1, shy, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
    return mat4x4;
}

// create a new 3-component vector with values x,y,z
function Vector3(x, y, z) {
    let vec3 = new Vector(3);
    vec3.values = [x, y, z];
    return vec3;
}

// create a new 4-component vector with values x,y,z,w
function Vector4(x, y, z, w) {
    let vec4 = new Vector(4);
    vec4.values = [x, y, z, w];
    return vec4;
}

export {
    mat4x4Perspective,
    mat4x4MPer,
    mat4x4Viewport,
    mat4x4Identity,
    mat4x4Translate,
    mat4x4Scale,
    mat4x4RotateX,
    mat4x4RotateY,
    mat4x4RotateZ,
    mat4x4ShearXY,
    Vector3,
    Vector4
};
