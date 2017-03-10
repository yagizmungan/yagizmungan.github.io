THREE.RoundedRectGeometry = function (radius, length) {

    THREE.Geometry.call(this);

    this.type = 'RoundedRectGeometry';

    this.parameters = {
        radius: radius,
        length: length,
    };

    radius = radius !== undefined ? radius : 10;
    length = length !== undefined ? length : 60;

    circleGeometry = new THREE.CircleGeometry(radius, 32);
    rectangleGeometry = new THREE.PlaneGeometry(2 * radius, length - 2 * (radius), 32);

    var rectangle = new THREE.Mesh(rectangleGeometry);
    x = rectangle.position.x;
    y = rectangle.position.y;
    z = rectangle.position.z;

    var circle1 = new THREE.Mesh(circleGeometry);
    circle1.position.x = x;
    circle1.position.y = y - (length / 2) + radius;
    circle1.position.z = z;

    var circle2 = new THREE.Mesh(circleGeometry);
    circle2.position.x = x;
    circle2.position.y = y + (length / 2) - radius;
    circle2.position.z = z;

    THREE.GeometryUtils.merge(this, circle1);
    THREE.GeometryUtils.merge(this, rectangle);
    THREE.GeometryUtils.merge(this, circle2);
};

THREE.RoundedRectGeometry.prototype = Object.create(THREE.Geometry.prototype);
THREE.RoundedRectGeometry.prototype.constructor = THREE.RoundedRectGeometry;

THREE.RegularTriangleGeometry = function(position1, position2, position3) {
    THREE.Geometry.call(this);

    this.type = 'RegularTriangleGeometry';

    this.parameters = {
        position1: position1,
        position2: position2,
        position3: position3,
    };

    position1 = position1 !== undefined ? position1 : {x: 0, y:0, z:0};
    position2 = position2 !== undefined ? position2 : {x: 1, y:1, z:0};
    position3 = position3 !== undefined ? position3 : {x: 1, y:0, z:0};

    this.vertices.push(new THREE.Vector3(position1.x, position1.y, position1.z));
    this.vertices.push(new THREE.Vector3(position2.x, position2.y, position2.z));
    this.vertices.push(new THREE.Vector3(position3.x, position3.y, position3.z));
    this.faces.push(new THREE.Face3(0, 2, 1));
}

THREE.RegularTriangleGeometry.prototype = Object.create(THREE.Geometry.prototype);
THREE.RegularTriangleGeometry.prototype.constructor = THREE.RegularTriangleGeometry;

THREE.RegularHexagonGeometry = function(scale) {
    THREE.Geometry.call(this);

    this.type = 'RegularHexagonGeometry';

    this.parameters = {
        scale: scale,
    };

    scale = scale !== undefined ? scale : 10;
    
    this.scale = scale;

	var geometry = new THREE.Geometry(scale, scale, scale);
  
  var triangle1 = new THREE.RegularTriangleGeometry(
            {x: 0.866 * this.scale, y: 0.5 * this.scale,    z: 0},
            {x: 0,                  y: 0,                   z: 0},
            {x: 0,                  y: this.scale,          z: 0}
  );
  var triangle2 = new THREE.RegularTriangleGeometry(
            {x: 0.866 * this.scale, y: 0.5 * this.scale,z: 0},
            {x: 0,                  y: this.scale,      z: 0},
            {x: 0.866 * this.scale, y: 1.5 * this.scale,z: 0}
  );
  var triangle3 = new THREE.RegularTriangleGeometry(
            {x: 0.866 * this.scale,     y: 0.5 * this.scale,z: 0},
            {x: 0.866 * this.scale,     y: 1.5 * this.scale,z: 0},
            {x: 0.866 * this.scale * 2, y: this.scale,      z: 0}
  );
  var triangle4 = new THREE.RegularTriangleGeometry(
            {x: 0.866 * this.scale,     y: 0.5 * this.scale,z: 0},
            {x: 0.866 * this.scale * 2, y: this.scale,      z: 0},
            {x: 0.866 * this.scale * 2, y: 0,               z: 0}
  );
  var triangle5 = new THREE.RegularTriangleGeometry(
            {x: 0.866 * this.scale,     y: 0.5 * this.scale,    z: 0},
            {x: 0.866 * this.scale * 2, y: 0,                   z: 0},
            {x: 0.866 * this.scale,     y: -0.5 * this.scale,   z: 0}
  );
  var triangle6 = new THREE.RegularTriangleGeometry(
            {x: 0.866 * this.scale, y:  0.5 * this.scale,   z: 0},
            {x: 0.866 * this.scale, y: -0.5 * this.scale,   z: 0},
            {x: 0,                  y: 0,                   z: 0}
  );

  /*THREE.GeometryUtils.merge(this, triangle1);
  THREE.GeometryUtils.merge(this, triangle2);
  THREE.GeometryUtils.merge(this, triangle3);
  THREE.GeometryUtils.merge(this, triangle4);
  THREE.GeometryUtils.merge(this, triangle5);
  THREE.GeometryUtils.merge(this, triangle6);  */
  this.merge(triangle1);
  this.merge(triangle2);
  this.merge(triangle3);
  this.merge(triangle4);
  this.merge(triangle5);
  this.merge(triangle6);
}

THREE.RegularHexagonGeometry.prototype = Object.create(THREE.Geometry.prototype);
THREE.RegularHexagonGeometry.prototype.constructor = THREE.RegularHexagonGeometry;