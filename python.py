import os
import sys

from PIL import Image, ImageDraw

def convert_ao(path):
    print(path)
    if 'ao' not in path.lower():
        sys.stderr.write('WARNING: There is no AO mark in file name: "{}"\n'.format(path))
    image = Image.open(path)
    image_out = Image.new('L', image.size)
    for y in range(image.size[1]):
        for x in range(image.size[0]):
            if image.mode in ['1', 'L', 'P']:
                ao = float(image.getpixel((x, y))) / 255.0
            else:
                ao = float(image.getpixel((x, y))[0]) / 255.0
            ao = 0.3 + ao * 2.0 * 0.7 # Might be adjusted for a particular mod.
            gray = int(ao * 255)
            if gray < 0:
                gray = 0
            elif gray > 255:
                gray = 255
            image_out.putpixel((x, y), (gray))
    image_out.save(path)

def convert_recursively(path):
    for file_name in os.listdir(path):
        file_path = os.path.join(path, file_name)
        if os.path.isfile(file_path):
            name, ext = os.path.splitext(file_name)
            if ext.lower() in ['.png']:
                convert_ao(file_path)
        elif os.path.isdir(file_path):
            convert_recursively(file_path)

if __name__ == '__main__':
    paths = sys.argv[1:]
    for path in paths:
        if os.path.isfile(path):
            convert_ao(path)
        elif os.path.isdir(path):
            convert_recursively(path)
