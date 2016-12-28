int fcount, lastm;
float frate;
int fint = 3;

void setup() {
  //fullScreen(P3D);
  size(600,400,P3D);
  frameRate(60);
  noSmooth();
  noStroke();
}

void drawFps() {
  fcount += 1;
  int m = millis();
  if (m - lastm > 1000 * fint) {
    frate = float(fcount) / fint;
    fcount = 0;
    lastm = m;
    println("fps: " + frate);
  }
  fill(0, 255, 0);
  text("fps: " + frate, 10, 20);
}

void draw() {
  background(0x333377);
  lights();
  
  pushMatrix(); 
  
  translate(width/2, height/2, -100);
  rotateX(-0.3);
  rotateY(frameCount * PI/200);
  
  int nrX = 60;
  int nrY = 1;
  int nrZ = 60;
  int boxSize = width / (3 * max(nrX, nrZ));

  fill(255,255,0);
  for(int x=0; x < nrX; x++){
    for(int y=0; y < nrY; y++){
      for(int z=0; z < nrZ; z++){
        pushMatrix();
        translate(
          (2 * x - nrX + 1) * boxSize, 
          (2 * y - nrY + 1) * boxSize, 
          (2 * z - nrZ + 1) * boxSize);
        box(boxSize + max(0.0, 1 * boxSize * sin(0.4 * sqrt(x * x + z * z + y * y) - frameCount /8.0 )));
        popMatrix();
      }
    }
  }

  popMatrix();
  drawFps();
}