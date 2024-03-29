/*
 * In this file you can specify all sort of updaters
 *  We provide an example of simple updater that updates pixel positions based on initial velocity and gravity
 */

////////////////////////////////////////////////////////////////////////////////
// Collisions
////////////////////////////////////////////////////////////////////////////////

var Collisions = Collisions || {};

Collisions.SinkBox = function ( particleAttributes, alive, delta_t, lower, upper) {
	var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

		if (pos.x > lower.x && pos.x < upper.x && pos.y > lower.y && pos.y < upper.y && pos.z > lower.z && pos.z < upper.z) {
			killPartilce(i, particleAttributes, alive);			
		}
		
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
}

Collisions.BounceBox = function ( particleAttributes, alive, delta_t, lower, upper, damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

		if (pos.x > lower.x && pos.x < upper.x && pos.y > lower.y && pos.y < upper.y && pos.z > lower.z && pos.z < upper.z) {
		
			//find closest
			var closest = 0;
			var min_d = upper.y - pos.y;

			if (upper.x - pos.x < min_d) {
				min_d = upper.x - pos.x;
				closest = 1;
			}
			if (upper.z - pos.z < min_d) {
				min_d = upper.z - pos.z;
				closest = 2;
			}
			if (pos.x - lower.x < min_d) {
				min_d = pos.x - lower.x;
				closest = 3;
			}
			if (pos.z - lower.z < min_d) {
				min_d = pos.z - lower.z;
				closest = 4;
			}
		
			if (closest == 0 && vel.y < 0) {
				vel = new THREE.Vector3(vel.x, -vel.y * damping, vel.z);
			} 
			
			if (closest == 1 && vel.x < 0) {
				vel = new THREE.Vector3(-vel.x * damping, vel.y, vel.z);
			}
			
			if (closest == 2 && vel.z < 0) {
				vel = new THREE.Vector3(vel.x, vel.y, -vel.z * damping);
			}
			
			if (closest == 3 && vel.x > 0) {
				vel = new THREE.Vector3(-vel.x * damping, vel.y, vel.z);
			}
			
			if (closest == 4 && vel.z > 0) {
				vel = new THREE.Vector3(vel.x, vel.y, -vel.z * damping);
			}
			
		}
		
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
};

Collisions.BouncePlane = function ( particleAttributes, alive, delta_t, plane,damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

		if (pos.y < plane.y && vel.y < 0) {
			vel = new THREE.Vector3(vel.x, -vel.y * damping, vel.z);
		}
		
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
};

Collisions.SinkPlane = function ( particleAttributes, alive, delta_t, plane  ) {
    var positions   = particleAttributes.position;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );

		if (pos.y < plane.y) {
			killPartilce(i, particleAttributes, alive)
		}

        // ----------- STUDENT CODE END ------------
    }
};

Collisions.BounceSphere = function ( particleAttributes, alive, delta_t, sphere, damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

		var c = new THREE.Vector3(sphere.x, sphere.y, sphere.z);
		var p = (new THREE.Vector3()).copy(pos);
		
		var diff = p.sub(c);
		var d = diff.length();
		if (d < (1.001*sphere.w)) {
	//		var n = (new THREE.Vector3().copy(diff)).normalize();
	//		vel = vel.sub(n.multiplyScalar(vel.dot(n)));
			vel = new THREE.Vector3(0,0,0);
			pos = c.add(diff.normalize().multiplyScalar(sphere.w*1.001));
		}
		
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
}

////////////////////////////////////////////////////////////////////////////////
// Null updater - does nothing
////////////////////////////////////////////////////////////////////////////////

function VoidUpdater ( opts ) {
    this._opts = opts;
    return this;
};

VoidUpdater.prototype.update = function ( particleAttributes, initialized, delta_t ) {
    //do nothing
};

////////////////////////////////////////////////////////////////////////////////
// Euler updater
////////////////////////////////////////////////////////////////////////////////

function EulerUpdater ( opts ) {
    this._opts = opts;
    return this;
};


EulerUpdater.prototype.updatePositions = function ( particleAttributes, alive, delta_t ) {
    var positions  = particleAttributes.position;
    var velocities = particleAttributes.velocity;

    for ( var i  = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var p = getElement( i, positions );
        var v = getElement( i, velocities );
        p.add( v.clone().multiplyScalar( delta_t ) );
        setElement( i, positions, p );
    }
};

EulerUpdater.prototype.updateVelocities = function ( particleAttributes, alive, delta_t ) {
    var positions = particleAttributes.position;
    var velocities = particleAttributes.velocity;
    var gravity = this._opts.externalForces.gravity;
    var attractors = this._opts.externalForces.attractors;

    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var p = getElement( i, positions );
        var v = getElement( i, velocities );
        // now update velocity based on forces...
		var g = (new THREE.Vector3().copy(gravity)).multiplyScalar(delta_t); //no divide by 2?
		v.add(g);
		
		
		for (var j = 0; j < attractors.length; j++) {
			var r = attractors[j].radius;
			var c = (new THREE.Vector3()).copy(attractors[j].center);
			var diff = c.sub(p);
			var d = diff.length();
			diff.normalize();
			if (d > r) {
				var a = diff.multiplyScalar(1/(d*d+r)).multiplyScalar(delta_t).multiplyScalar(r*r*r);
				v.add(a);
			}
			
		}
		
        setElement( i, velocities, v );
        // ----------- STUDENT CODE END ------------
    }

};

EulerUpdater.prototype.updateColors = function ( particleAttributes, alive, delta_t ) {
    var colors    = particleAttributes.color;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var c = getElement( i, colors );

		var r = c.x;
		var g = c.y;
		var b = c.z;
		
		r -= (delta_t/4);
		if (r < 0) {
			r = 0;
			g -= (delta_t/4)
			if (g < 0) {
				g = 0;
			}
		}
		
		c.x = r;
		c.y = g;
		
        setElement( i, colors, c );
        // ----------- STUDENT CODE END ------------
    }
};

EulerUpdater.prototype.updateSizes= function ( particleAttributes, alive, delta_t ) {
    var sizes    = particleAttributes.size;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var s = getElement( i, sizes );

        setElement( i, sizes, s );
        // ----------- STUDENT CODE END ------------
    }

};

EulerUpdater.prototype.updateLifetimes = function ( particleAttributes, alive, delta_t) {
    var positions     = particleAttributes.position;
    var lifetimes     = particleAttributes.lifetime;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;

        var lifetime = getElement( i, lifetimes );

        if ( lifetime < 0 ) {
            killPartilce( i, particleAttributes, alive );
        } else {
            setElement( i, lifetimes, lifetime - delta_t );
        }
    }

};

EulerUpdater.prototype.collisions = function ( particleAttributes, alive, delta_t ) {
    if ( !this._opts.collidables ) {
        return;
    }
    if ( this._opts.collidables.bouncePlanes ) {
        for (var i = 0 ; i < this._opts.collidables.bouncePlanes.length ; ++i ) {
            var plane = this._opts.collidables.bouncePlanes[i].plane;
            var damping = this._opts.collidables.bouncePlanes[i].damping;
            Collisions.BouncePlane( particleAttributes, alive, delta_t, plane, damping );
        }
    }

    if ( this._opts.collidables.sinkPlanes ) {
        for (var i = 0 ; i < this._opts.collidables.sinkPlanes.length ; ++i ) {
            var plane = this._opts.collidables.sinkPlanes[i].plane;
            Collisions.SinkPlane( particleAttributes, alive, delta_t, plane );
        }
    }

    if ( this._opts.collidables.spheres ) {
        for (var i = 0 ; i < this._opts.collidables.spheres.length ; ++i ) {
            Collisions.Sphere( particleAttributes, alive, delta_t, this._opts.collidables.spheres[i] );
        }
    }
	
	if ( this._opts.collidables.bounceBox) {
		for (var i = 0 ; i < this._opts.collidables.bounceBox.length ; ++i ) {
			var lower = this._opts.collidables.bounceBox[i].lower;
			var upper = this._opts.collidables.bounceBox[i].upper;
            var damping = this._opts.collidables.bounceBox[i].damping;
			Collisions.BounceBox( particleAttributes, alive, delta_t, lower, upper, damping );
        }
	}
	
	if ( this._opts.collidables.sinkBox) {
		for (var i = 0 ; i < this._opts.collidables.sinkBox.length ; ++i ) {
			var lower = this._opts.collidables.sinkBox[i].lower;
			var upper = this._opts.collidables.sinkBox[i].upper;
			Collisions.SinkBox( particleAttributes, alive, delta_t, lower, upper);
        }
	}
	
};

EulerUpdater.prototype.update = function ( particleAttributes, alive, delta_t ) {

    this.updateLifetimes( particleAttributes, alive, delta_t );
    this.updateVelocities( particleAttributes, alive, delta_t );
    this.updatePositions( particleAttributes, alive, delta_t );

    this.collisions( particleAttributes, alive, delta_t );

    this.updateColors( particleAttributes, alive, delta_t );
    this.updateSizes( particleAttributes, alive, delta_t );

    // tell webGL these were updated
    particleAttributes.position.needsUpdate = true;
    particleAttributes.color.needsUpdate = true;
    particleAttributes.velocity.needsUpdate = true;
    particleAttributes.lifetime.needsUpdate = true;
    particleAttributes.size.needsUpdate = true;

}


function ClothUpdater ( opts ) {
    this._opts = opts;
    this._s = 10.0;
    this._k_s = 0.55;
    return this;
}

ClothUpdater.prototype.calcHooke = function ( p, q ) {
    // ----------- STUDENT CODE BEGIN ------------
    var k_s = this._k_s;
    var rest_len = this._s;

	var D = ((new THREE.Vector3()).copy(p)).sub(q);
	var d = D.length();
	D.normalize();
	
	var f = D.multiplyScalar(-60*k_s*(d-rest_len));
	
    return f;
    // ----------- STUDENT CODE END ------------
}

ClothUpdater.prototype.updatePositions = function ( particleAttributes, alive, delta_t ) {
    var positions  = particleAttributes.position;
    var velocities = particleAttributes.velocity;

    for ( var i  = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var p = getElement( i, positions );
        var v = getElement( i, velocities );
        p.add( v.clone().multiplyScalar( delta_t ) );
        setElement( i, positions, p );
    }
};

ClothUpdater.prototype.updateVelocities = function ( particleAttributes, alive, delta_t, width, height ) {
    var positions = particleAttributes.position;
    var velocities = particleAttributes.velocity;
    var gravity = this._opts.externalForces.gravity;
    var attractors = this._opts.externalForces.attractors;

    for ( var j = 0 ; j < height; ++j ) {
        for ( var i = 0 ; i < width ; ++i ) {
            var idx = j * width + i;

            // ----------- STUDENT CODE BEGIN ------------
            var p = getElement( idx, positions );
            var v = getElement( idx, velocities );

            // calculate forces on this node from neighboring springs 
            // (using this.calcHooke()... )
			//4 neighbors
			var idx_left = idx - 1;
			var idx_right = idx + 1;
			var idx_down = idx - width;
			var idx_up = idx + width;
			
			if (idx_left > 0 && (i != 0)) { // check if on other side
				var f_left = this.calcHooke(p, getElement(idx_left, positions));
			//	if (f_left.length() < 1)
					v.add(f_left.multiplyScalar(delta_t));
			}
			if (idx_right < width*height && (i != width - 1)) { //check if on other side
				var f_right = this.calcHooke(p, getElement(idx_right, positions));
			//	if (f_right.length() < 1)
					v.add(f_right.multiplyScalar(delta_t));
			} 
			if (idx_down > 0) {
				var f_down = this.calcHooke(p, getElement(idx_down, positions));
				v.add(f_down.multiplyScalar(delta_t));
			}
			if (idx_up < width*height) {
				var f_up = this.calcHooke(p, getElement(idx_up, positions));
				v.add(f_up.multiplyScalar(delta_t));
			} 

		/*	if (Math.random() < 0.0001) {
				console.log(f_left);
			}
			*/

			
			var g = (new THREE.Vector3().copy(gravity)).multiplyScalar(delta_t); //no divide by 2?
			v.add(g);
		
			
            setElement( idx, velocities, v );
            // ----------- STUDENT CODE END ------------
        }
    }

};


ClothUpdater.prototype.collisions = function ( particleAttributes, alive, delta_t ) {
    if ( !this._opts.collidables ) {
        return;
    }
    if ( this._opts.collidables.bouncePlanes ) {
        for (var i = 0 ; i < this._opts.collidables.bouncePlanes.length ; ++i ) {
            var plane = this._opts.collidables.bouncePlanes[i].plane;
            var damping = this._opts.collidables.bouncePlanes[i].damping;
            Collisions.BouncePlane( particleAttributes, alive, delta_t, plane, damping );
        }
    }

    if ( this._opts.collidables.sinkPlanes ) {
        for (var i = 0 ; i < this._opts.collidables.sinkPlanes.length ; ++i ) {
            var plane = this._opts.collidables.sinkPlanes[i].plane;
            Collisions.SinkPlane( particleAttributes, alive, delta_t, plane );
        }
    }

    if ( this._opts.collidables.bounceSpheres ) {
        for (var i = 0 ; i < this._opts.collidables.bounceSpheres.length ; ++i ) {
            var sphere = this._opts.collidables.bounceSpheres[i].sphere;
            var damping = this._opts.collidables.bounceSpheres[i].damping;
            Collisions.BounceSphere( particleAttributes, alive, delta_t, sphere, damping );
        }
    }
};


ClothUpdater.prototype.update = function ( particleAttributes, alive, delta_t, width, height ) {

    this.updateVelocities( particleAttributes, alive, delta_t, width, height );
    this.updatePositions( particleAttributes, alive, delta_t, width, height );

    this.collisions( particleAttributes, alive, delta_t );

    // tell webGL these were updated
    particleAttributes.position.needsUpdate = true;
    particleAttributes.color.needsUpdate = true;
    particleAttributes.velocity.needsUpdate = true;
    particleAttributes.lifetime.needsUpdate = true;
    particleAttributes.size.needsUpdate = true;
}
