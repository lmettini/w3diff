
import javax.imageio.ImageIO
import java.awt.image.BufferedImage
import java.io.File
import java.util.Calendar
import java.awt.Color
import java.lang.Math

def image1 = ImageIO.read(new File("test1.png"))
def image2 = ImageIO.read(new File("test2.png"))
def red = new Color(250, 0, 0).getRGB();



def im1W = image1.getWidth()
def im1H = image1.getHeight()
def im2W = image2.getWidth()
def im2H = image2.getHeight()


def maxwidth = Math.max(im1W,im2W)
def maxheight = Math.max(im1H,im2H)


def minwidth = Math.min(im1W,im2W)
def minheight = Math.min(im1H,im2H)

def result = new BufferedImage(maxwidth, maxheight, image1.getType())

println image1
println "==========="
println image2


for(int i=0;i<minwidth;i++){
	for(int j=0;j<minheight;j++){
		if(image1.getRGB(i,j)!=image2.getRGB(i,j)){
			result.setRGB(i,j,red)
		}
	}	
}

println "==========="
println result

File outputfile = new File("result.png");
ImageIO.write(result, "png", outputfile);

