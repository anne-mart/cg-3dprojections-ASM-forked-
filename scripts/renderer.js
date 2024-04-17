import * as CG from './transforms.js';
import { Matrix, Vector } from "./matrix.js";

const LEFT =   32; // binary 100000
const RIGHT =  16; // binary 010000
const BOTTOM = 8;  // binary 001000
const TOP =    4;  // binary 000100
const FAR =    2;  // binary 000010
const NEAR =   1;  // binary 000001
const FLOAT_EPSILON = 0.000001;

class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // scene:               object (...see description on Canvas)
    constructor(canvas, scene) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.scene = this.processScene(scene);
        this.enable_animation = true;  // <-- disabled for easier debugging; enable for animation
        this.start_time = null;
        this.prev_time = null;
    }

    updateTransforms(time, delta_time) { //NOT DONE/////////////////////////
        // TODO: update any transformations needed for animation

        // for(let n = 0; n < this.scene.models.length; n++) {
        //     for(let i = 0; i < this.scene.models[n].vertices.length; i++) {
        //                 // rotate
        //     CG.mat3x3Rotate(this.models.slide1[0].rotate, this.models.slide1[0].theta);
        //     // translate to the desired location
        //     let tx_1 = this.models.slide1[0].center.values[0][0] + this.models.slide1[0].velocity[0] * delta_time/1000;
        //     let ty_1 = this.models.slide1[0].center.values[1][0] + this.models.slide1[0].velocity[1] * delta_time/1000;
        //     let tz_1 = this.models.slide1[0].center.values[1][0] + this.models.slide1[0].velocity[1] * delta_time/1000;


        //     CG.mat3x3Translate(this.models.slide1[0].translate, tx_1, ty_1);

        //     CG.mat3x3Rotate(this.models.slide1[1].rotate1, this.models.slide1[1].theta);
        //     let tx_2 = this.models.slide1[1].center.values[0][0] + this.models.slide1[1].velocity[0] * delta_time/1000;
        //     let ty_2 = this.models.slide1[1].center.values[1][0] + this.models.slide1[1].velocity[1] * delta_time/1000;
        //     CG.mat3x3Translate(this.models.slide1[1].translate1, tx_2, ty_2);

        //     CG.mat3x3Rotate(this.models.slide1[2].rotate2, this.models.slide1[2].theta);
        //     let tx_3 = this.models.slide1[2].center.values[0][0] + this.models.slide1[2].velocity[0] * delta_time/1000;
        //     let ty_3 = this.models.slide1[2].center.values[1][0] + this.models.slide1[2].velocity[1] * delta_time/1000;
        //     CG.mat3x3Translate(this.models.slide1[2].translate2, tx_3, ty_3);
        //     }
        // }

    }

    //translation matrix to get back to origin
    //then do rotation matrix
    //translation matrix back to original center
    


    //
    rotateLeft() {
       // console.log(this.scene.view.srp.values[0][0]);
        let value = this.scene.view.srp.values[0][0] - 1;
        this.scene.view.srp.values[0][0] = value;
    }
    
    //
    rotateRight() {
        let value = this.scene.view.srp.values[0][0] + 1;
        this.scene.view.srp.values[0][0] = value;
    }
    
    //
    moveLeft() {
        let value = this.scene.view.srp.values[0][0] - 1;
        this.scene.view.srp.values[0][0] = value;
        value = this.scene.view.prp.values[0][0] - 1;
        this.scene.view.prp.values[0][0] = value;
    }
    
    //
    moveRight() {
        let value = this.scene.view.srp.values[0][0] + 1;
        this.scene.view.srp.values[0][0] = value;
        value = this.scene.view.prp.values[0][0] + 1;
        this.scene.view.prp.values[0][0] = value;
    }
    
    //
    moveBackward() {
        let value = this.scene.view.srp.values[2][0] + 1;
        this.scene.view.srp.values[2][0] = value;
        value = this.scene.view.prp.values[2][0] + 1;
        this.scene.view.prp.values[2][0] = value;
    }
    
    //
    moveForward() {
        let value = this.scene.view.srp.values[2][0] - 1;
        this.scene.view.srp.values[2][0] = value;
        value = this.scene.view.prp.values[2][0] - 1;
        this.scene.view.prp.values[2][0] = value;
    }

    //
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //console.log(this.scene);
        //console.log(this.scene.view);
        // TODO: implement drawing here!
        // For each model
        //   * For each vertex
        //     * transform endpoints to canonical view volume
        //   * For each line segment in each edge
        //     * clip in 3D
        //     * project to 2D
        //     * translate/scale to viewport (i.e. window)
        //     * draw line
        let points = []; //list of points after all calculations
        let perspective = this.scene.view; //loading view data from scene
        let perspective_mat = CG.mat4x4Perspective(perspective.prp, perspective.srp, perspective.vup, perspective.clip); // perspective matrix
        let veiw_mat = CG.mat4x4Viewport(this.canvas.width, this.canvas.height); //view matrix
        for(let n = 0; n < this.scene.models.length; n++) {
            for(let i = 0; i < this.scene.models[n].vertices.length; i++) {
                let point = new Vector(4);
                point.values = this.scene.models[n].vertices[i].data; //grab one vertex
                point = Matrix.multiply([perspective_mat, point]); //multiply perspective matrix with vertex
                point = Matrix.multiply([veiw_mat, CG.mat4x4MPer(), point]); //project to 2D and translate/scale

                //convert to cartesian coords
                let x = point.values[0] / point.values[3];
                let y = point.values[1] / point.values[3];
                point.values[0][0] = x;
                point.values[1][0] = y;
                points[i] = point;
            }  
        // const points3 = {
        //     point0: { x: 200, y: 0},
        //     point1: { x: this.canvas.width+1, y: 500}
        // };
      //  this.clipLinePerspective(points3, 1);     
  /////////////////////////////////////////////////////////////////////////////////////////////////// ANNE
        // const points3 = {
        //     point0: { x: 200, y: 0},
        //     point1: { x: this.canvas.width+1, y: 500}
        // };
        // this.clipLinePerspective(points3, 1);     
/////////////////////////////////////////////////////////////////////////////////////////////////// ANNE
            //draw lines
            for(let i = 0; i < this.scene.models[n].edges.length; i++) {
                let edge = this.scene.models[n].edges[i]; //gets one edge
                //draw edge
                for(let j = 0; j < edge.length - 1; j++) {
                    //do clipping here
                    // make points the line and clip zmin = -near/far (4 is near 5 is far (indices))
                    this.drawLine(points[edge[j]].values[0], points[edge[j]].values[1], points[edge[j + 1]].values[0], points[edge[j + 1]].values[1]);
                //     const points2 = {
                //         point0: { x: points[edge[j]].values[0], y: points[edge[j]].values[1] },
                //         point1: { x: points[edge[j + 1]].values[0], y: points[edge[j + 1]].values[1] }
                //     };
                //   this.clipLinePerspective(points2, 1);     
                }
            }
        }

    }

    // Get outcode for a vertex
    // vertex:       Vector4 (transformed vertex in homogeneous coordinates)
    // z_min:        float (near clipping plane in canonical view volume)
    outcodePerspective(vertex, z_min) {
        let outcode = 0;
        if (vertex.x < (vertex.z - FLOAT_EPSILON)) {
            outcode += LEFT;
        }
        else if (vertex.x > (-vertex.z + FLOAT_EPSILON)) {
            outcode += RIGHT;
        }
        if (vertex.y < (vertex.z - FLOAT_EPSILON)) {
            outcode += BOTTOM;
        }
        else if (vertex.y > (-vertex.z + FLOAT_EPSILON)) {
            outcode += TOP;
        }
        if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
            outcode += FAR;
        }
        else if (vertex.z > (z_min + FLOAT_EPSILON)) {
            outcode += NEAR;
        }
        return outcode;
    }

    // Clip line - should either return a new line (with two endpoints inside view volume)
    //             or null (if line is completely outside view volume)
    // line:         object {pt0: Vector4, pt1: Vector4}
    // z_min:        float (near clipping plane in canonical view volume)
    clipLinePerspective(line, z_min) {
       // this.drawLine(0,0,500,500);
     //  this.drawLine(0, 0, 300, 300);
        let result = null;
        //let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z); 
        // let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
        // let out0 = this.outcodePerspective(p0, z_min);
        // let out1 = this.outcodePerspective(p1, z_min);
        
        // TODO: implement clipping here!

    //BOTTOM
        //need to check if the line passes through the bottom of the window y < ymin **(Outcode 0100)**
        if(line.point1.y < 0 || line.point0.y < 0){

            let m = (line.point1.y-line.point0.y)/(line.point1.x-line.point0.x); //m=(y2-y1)/(x2-x1)

            //need to calculate where line crosses x-axis (where y=0)
            let x_intercept = line.point0.x - (line.point0.y/m);
            
            this.drawLine(line.point0.x,line.point0.y, x_intercept, 0);
        }

    //TOP  
        //need to check if the line passes through the top of the window y > ymin **(Outcode 1000)**
        if(line.point1.y > this.canvas.height || line.point0.y > this.canvas.height){

            let m = (line.point1.y-line.point0.y)/(line.point1.x-line.point0.x); //m=(y2-y1)/(x2-x1)

            //need to calculate where line crosses x-axis (where y=canvas height)
            let x_intercept = line.point0.x - ((line.point0.y - this.canvas.height)/m);

            this.drawLine(line.point0.x,line.point0.y, x_intercept, this.canvas.height);
        }

    //LEFT
        //need to check if the line passes through the left of the window x < 0 **(Outcode 0001)**
        if(line.point1.x < 0 || line.point0.x < 0){
            let m = (line.point1.y-line.point0.y)/(line.point1.x-line.point0.x); //m=(y2-y1)/(x2-x1)

            //need to calculate where line crosses y-axis (where x=0)
            let y_intercept = line.point0.y -(line.point0.x * m);
            
            this.drawLine(line.point0.x,line.point0.y, 0, y_intercept);
        }

    //RIGHT
        //need to check if the line passes through the right of the window x > xmax **(Outcode 0010)**
        if(line.point1.x > this.canvas.width || line.point0.x > this.canvas.width){
            let m = (line.point1.y-line.point0.y)/(line.point1.x-line.point0.x); //m=(y2-y1)/(x2-x1)

            //need to calculate where line crosses y-axis (where x=0)
            let y_intercept = line.point0.y + m * (this.canvas.width - line.point0.x);
            
            this.drawLine(line.point0.x, line.point0.y, this.canvas.width, y_intercept);
        }

        
    //Z-AXIS
        //need to check if the line passes through the right of the window x > xmax **(Outcode 0010)**
        if(line.point1.z > this.canvas.z_min){ //this might be line.point1.z < this.canvas.z_min
            // let m = (line.point1.y-line.point0.y)/(line.point1.x-line.point0.x); //m=(y2-y1)/(x2-x1)

            // //need to calculate where line crosses y-axis (where x=0)
            // let y_intercept = line.point0.y + m * (this.canvas.width - line.point0.x);
            
            // this.drawLine(line.point0.x, line.point0.y, this.canvas.width, y_intercept);
        } 

    }

    //
    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.draw();

        // Invoke call for next frame in animation
        if (this.enable_animation) {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateScene(scene) {
        this.scene = this.processScene(scene);
        if (!this.enable_animation) {
            this.draw();
        }
    }

    //
    processScene(scene) {
        let processed = {
            view: {
                prp: CG.Vector3(scene.view.prp[0], scene.view.prp[1], scene.view.prp[2]),
                srp: CG.Vector3(scene.view.srp[0], scene.view.srp[1], scene.view.srp[2]),
                vup: CG.Vector3(scene.view.vup[0], scene.view.vup[1], scene.view.vup[2]),
                clip: [...scene.view.clip]
            },
            models: []
        };

        for (let i = 0; i < scene.models.length; i++) {
            let model = { type: scene.models[i].type };
            if (model.type === 'generic') {
                model.vertices = [];
                model.edges = JSON.parse(JSON.stringify(scene.models[i].edges));
                for (let j = 0; j < scene.models[i].vertices.length; j++) {
                    model.vertices.push(CG.Vector4(scene.models[i].vertices[j][0],
                                                   scene.models[i].vertices[j][1],
                                                   scene.models[i].vertices[j][2],
                                                   1));
                    if (scene.models[i].hasOwnProperty('animation')) {
                        model.animation = JSON.parse(JSON.stringify(scene.models[i].animation));
                    }
                }
            }
            else {
                if (model.type === 'cube') {
                    model.vertices = [];
                    model.edges = [];
                    let center = JSON.parse(JSON.stringify(scene.models[i].center));
                    let x = JSON.parse(JSON.stringify(scene.models[i].width));
                    let y = JSON.parse(JSON.stringify(scene.models[i].height));
                    let z = JSON.parse(JSON.stringify(scene.models[i].depth));

                    model.edges.push([0, 1, 2, 3, 0]);
                    model.edges.push([4, 5, 6, 7, 4]);

                    for(let j = 0; j < 4; j++) {
                        model.edges.push([model.edges[0][j], model.edges[1][j]]);
                    }

                    model.vertices.push(CG.Vector4(center[0] - (x / 2), center[1] + (y / 2), center[2] + z / 2, 1));
                    model.vertices.push(CG.Vector4(center[0] + (x / 2), center[1] + (y / 2), center[2] + z / 2, 1));
                    model.vertices.push(CG.Vector4(center[0] + (x / 2), center[1] - (y / 2), center[2] + z / 2, 1));
                    model.vertices.push(CG.Vector4(center[0] - (x / 2), center[1] - (y / 2), center[2] + z / 2, 1));

                    model.vertices.push(CG.Vector4(center[0] - (x / 2), center[1] + (y / 2), center[2] - z / 2, 1));
                    model.vertices.push(CG.Vector4(center[0] + (x / 2), center[1] + (y / 2), center[2] - z / 2, 1));
                    model.vertices.push(CG.Vector4(center[0] + (x / 2), center[1] - (y / 2), center[2] - z / 2, 1));
                    model.vertices.push(CG.Vector4(center[0] - (x / 2), center[1] - (y / 2), center[2] - z / 2, 1));

                    
                } else if (model.type === 'cylinder') {
                    let a = 0;
                    let num_edges = scene.models[i].sides;
                    let angle = 360 / num_edges;
                    model.vertices = [];
                    model.edges = [];
                    let center = scene.models[i].center;
                    let r = scene.models[i].radius;
                    let y = scene.models[i].height;
                    
                    let edge_1 = [];
                    let edge_2 = [];
                    for(let i = 0; i < num_edges; i++) {
                        edge_1.push(i);
                        edge_2.push(i + num_edges);
                    }
                    edge_1.push(0);
                    edge_2.push(num_edges);
                    model.edges.push(edge_1);
                    model.edges.push(edge_2);

                    for(let j = 0; j < model.edges[0].length - 1; j++) {
                        model.edges.push([model.edges[0][j], model.edges[1][j]]);
                    }

                    for(let i = 0; i < num_edges; i++) {
                        let x = center[0] + r * Math.cos(a * Math.PI / 180);
                        let z = center[2] + r * Math.sin(a * Math.PI / 180);
                        model.vertices.push(CG.Vector4(x, center[1] + (y / 2), z, 1));
                        a += angle;

                    }
                    a = 0;
                    for(let i = 0; i < num_edges; i++) {
                        let x = center[0] + r * Math.cos(a * Math.PI / 180);
                        let z = center[2] + r * Math.sin(a * Math.PI / 180);
                        model.vertices.push(CG.Vector4(x, center[1] - (y / 2), z, 1));
                        a += angle;
                    }

                } else if (model.type === 'cone') {
                    let a = 0;
                    let num_edges = scene.models[i].sides;
                    let angle = 360 / num_edges;
                    model.vertices = [];
                    model.edges = [];
                    let center = scene.models[i].center;
                    let r = scene.models[i].radius;
                    let y = scene.models[i].height;
                    
                    let edge_1 = [];
                    for(let i = 1; i <= num_edges; i++) {
                        edge_1.push(i);
                    }
                    edge_1.push(1);
                    model.edges.push(edge_1);

                    for(let j = 0; j < model.edges[0].length - 1; j++) {
                        model.edges.push([0, model.edges[0][j]]);
                    }

                    model.vertices.push(CG.Vector4(center[0], center[1] + (y / 2), center[2], 1));

                    a = 0;
                    for(let i = 0; i < num_edges; i++) {
                        let x = center[0] + r * Math.cos(a * Math.PI / 180);
                        let z = center[2] + r * Math.sin(a * Math.PI / 180);
                        model.vertices.push(CG.Vector4(x, center[1] - (y / 2), z, 1));
                        a += angle;
                    }

                } else if (model.type === 'sphere') {
                    let a = 0;
                    let slices = scene.models[i].slices;
                    let stacks = scene.models[i].stacks;
                    let num_points = stacks * 2 ;
                    let circle_angle = 360 / (num_points);
                    let sphere_angle = 360 / slices;
                    model.vertices = [];
                    model.edges = [];
                    let center = scene.models[i].center;
                    let r = scene.models[i].radius;

                    
                    let num = 0
                    for(let i = 0; i < num_points; i++) {
                        let edge_1 = [];

                        for(let j = num; j < num + num_points; j++) {
                            edge_1.push(j);
                        }
                        edge_1.push(num);
                        num += num_points;
                        model.edges.push(edge_1);
                    }
                    for(let i = 0; i < stacks - 1; i++) {
                        let edge = [];
                        let p = i;

                        if (i < stacks / 2) {
                            for(let j = 0; j < num_points / 2; j++) {
                                edge.push(p)
                                p += num_points;
                            }
                            
                            for(let j = 0; j < num_points / 2; j++) {
                                if(model.edges.length < slices + 1) {
                                    edge.push(edge[j] + stacks);
                                } else {
                                    edge.push(model.edges[model.edges.length - 1][stacks + j] - 1);
                                    //console.log("h");
                                } 
                                
                                p += num_points;
                            }
                        } else {
                            if (i == stacks / 2 ) {
                                let temp = model.edges[slices];
                                for(let j = 0; j < stacks; j++) {
                                    edge.push(temp[stacks + j] + 1);
                                }
                                for(let j = 0; j < stacks - 1; j++) {
                                    edge.push(temp[j + 1] - 1);
                                }
                                edge.push(edge[edge.length - 1] + num_points)

                            } else {
                                let temp = model.edges[model.edges.length - 1];
                                for(let j = 0; j < stacks; j++) {
                                    edge.push(temp[ j] + 1);
                                }
                                for(let j = 0; j < stacks - 1; j++) {
                                    edge.push(temp[stacks + j] - 1);
                                }
                                edge.push(edge[edge.length - 1] + num_points)
                            }
                        }
                        edge.push(edge[0]);
                        model.edges.push(edge);
                    }
                    
                    let circle = [];
                    for(let i = 0; i < num_points; i++) {
                        let x = center[0] + r * Math.cos(a * Math.PI / 180);
                        let y = center[1] + r * Math.sin(a * Math.PI / 180);
                        circle.push(CG.Vector4(x, y , center[2], 1));
                        a += circle_angle;
                    }
                    a = 0;
                    
                    let trans1 = new Matrix(4, 4);
                    trans1 = CG.mat4x4Translate(trans1, center[0] * -1, center[1] * -1, center[2] * -1);
                    let trans2 = new Matrix(4, 4);
                    trans2 = CG.mat4x4Translate(trans2, center[0], center[1], center[2]);

                    for(let j = 0; j < slices; j++) {
                        let rotate = new Matrix(4, 4);
                        rotate = CG.mat4x4RotateY(rotate, a * Math.PI / 180);
                        for(let i = 0; i < num_points; i++) {
                            let point = Matrix.multiply([trans2, rotate, trans1, circle[i]]);
                            model.vertices.push(point);
                            
                        }
                        a += sphere_angle;

                    }

                }

                if (scene.models[i].hasOwnProperty('animation')) {
                    model.animation = JSON.parse(JSON.stringify(scene.models[i].animation));
                }
                // model.center = CG.Vector4(scene.models[i].center[0],
                //                        scene.models[i].center[1],
                //                        scene.models[i].center[2],
                //                        1);
                // for (let key in scene.models[i]) {
                //     if (scene.models[i].hasOwnProperty(key) && key !== 'type' && key != 'center') {
                //         model[key] = JSON.parse(JSON.stringify(scene.models[i][key]));
                //     }
                // }
            }

            model.matrix = new Matrix(4, 4);
            processed.models.push(model);
        }

        return processed;
    }
    
    // x0:           float (x coordinate of p0)
    // y0:           float (y coordinate of p0)
    // x1:           float (x coordinate of p1)
    // y1:           float (y coordinate of p1)
    drawLine(x0, y0, x1, y1) {
        this.ctx.strokeStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();

        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(x0 - 2, y0 - 2, 4, 4);
        this.ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
    }
};

export { Renderer };