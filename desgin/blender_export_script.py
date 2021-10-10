# exports 1-8000 bag into its own file

import os
import re
import bpy
import json

# reset materials
for mt in bpy.data.materials:
    mt.metallic = 0
    mt.specular_intensity = 0
    mt.roughness = 1

# export to blend file location
basedir = os.path.dirname(bpy.data.filepath)

if not basedir:
    raise Exception("Blend file is not saved")

rootdir = os.path.join(basedir, "..")
outputdir = os.path.join(basedir, "models")

view_layer = bpy.context.view_layer
selection = bpy.context.selected_objects
bpy.ops.object.select_all(action="DESELECT")
bpy.data.objects["fg"].select_set(True)

props = ["weapon", "chest", "head", "waist", "foot", "hand", "neck", "ring"]

with open(os.path.join(rootdir, "packages/data/loot.json")) as l:
        loot = json.load(l)
        
with open(os.path.join(rootdir, "packages/data/mapping.json")) as m:
        mapping = json.load(m)

for i in range(0, 8000):
    bag_selection = []

    bag = loot[i][str(i + 1)]

    for key in bag:
        name = re.sub(r'^".+?"\s', '', re.sub(r'\sof.+$', '', bag[key]))
        print(key + " : " + name)

        object_name = mapping[key][name]

        if object_name in bpy.data.objects:
            obj = bpy.data.objects[object_name]

            obj.hide_set(False)
            obj.select_set(True)

            bag_selection.append(obj)
        else:
            print("Not found:", object_name)

    # name = bpy.path.clean_name(obj.name)
    id = str(i + 1)
    fn = os.path.join(outputdir, id)

    bpy.ops.export_scene.gltf(filepath=fn + ".glb", use_selection=True)

    # Can be used for multiple formats
    # bpy.ops.export_scene.x3d(filepath=fn + ".x3d", use_selection=True)

    for obj in bag_selection:
        obj.hide_set(True)
        obj.select_set(False)

    print("written:", fn)


bpy.data.objects["fg"].select_set(False)

for obj in selection:
    obj.select_set(True)
