class Popup {
    constructor(x, y){
        this.x=x
        this.y=y
    }
    display(){
        stroke(0)
        strokeWeight(2)
        fill(146,149,148)
        rect(x,y,200,100)
        text(":)))",x+100,y+50)
    }
}