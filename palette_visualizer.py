primary_colors = [
'#FAFAFA',
'#F5F5F5',
'#EEEEEE',
'#E0E0E0',
'#BDBDBD',
'#9E9E9E',
'#757575',
'#616161',
'#424242',
'#212121',
]
secondary_colors = [
        '#FEFCE9',
        '#FCF7C9',
        '#FAF3A6',
        '#F7EE83',
        '#F4E96A',
        '#F0E451',
        '#E2D24C',
        '#CEBC45',
        '#BAA63F',
        '#998035'
]

prefix = """
<!DOCTYPE html>
<html>
<body>
"""
suffix = """
</body>
</html>
"""

primary_contrasts = [
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
        ('white', 0.7),
        ('white', 0.7),
        ('white', 0.7),
        ('white', 0.7),
]
secondary_contrasts = [
        ('black', 0.9),
        ('black', 0.9),
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
        ('black', 0.8),
]

# test contrasts

content = []
content_template = '<p style="display: inline; font-family: Helvetica; color: rgba({},{});">{}</p>'
for base in [primary_colors, secondary_colors]:
    for i in range(10):
        content.append('<div style="background-color:{}">'.format(base[i]))
        for color in [('B', '0,0,0'), ('W', '255,255,255')]:
            for j in range(1,11):
                content.append(content_template.format(
                    color[1],
                    j/10,
                    f"{i}{color[0]}{j/10}"))
        content.append('</div>')

with open('foo.html', 'w') as f:
    f.write(prefix)
    f.write('\n'.join(content))
    f.write(suffix)



# format palettes
keys = [50] + list([i for i in range(100, 1000,100)])

primary_palette = ['(']
for i in range(10):
    primary_palette.append(f'  {keys[i]}: {primary_colors[i]},')
primary_palette.append('  contrast: (')
for i in range(10):
    primary_palette.append(f'    {keys[i]}: rgba({primary_contrasts[i][0]}, {primary_contrasts[i][1]}),')
primary_palette.append('  )')
primary_palette.append(')')

secondary_palette = ['(']
secondary_palette.append(')')
secondary_palette = ['(']
for i in range(10):
    secondary_palette.append(f'  {keys[i]}: {secondary_colors[i]},')
secondary_palette.append('  contrast: (')
for i in range(10):
    secondary_palette.append(f'    {keys[i]}: rgba({secondary_contrasts[i][0]}, {secondary_contrasts[i][1]}),')
secondary_palette.append('  )')
secondary_palette.append(')')

with open('foo.txt', 'w') as f:
    f.write('\n'.join(primary_palette))
    f.write('\n')
    f.write('\n'.join(secondary_palette))
