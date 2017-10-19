Gulp Boilerplate for generic CSS/HTML/JS development
=============
<a href="http://helengaiuk.github.io" target="_blank">helengaiuk.github.io</a> gulp boilerplate.

Structure
=============
`/app/` - thats where you write code.

`/dist/` - compiled code. Do not ever edit this folder.

Structure of `app` folder:

`| _template` (in this folder we have html template files like `footer.html` ect)

`| fonts` (in this folder we put font files (in folders or into root))

`| img` (in root we put images)

`  |- sprite` (in this folder we put images to generate sprite)

`| js`

`  |- libs` (put js libraries into this folder)

`  |- partials` (put your js code here)

`  main.js` (there is main file that connects all other js filed. do not edit it)

`| scss` 

`  |- mixins` (put scss mixins into this folder)

`  |- partials` (put your scss code here)

`  main.scss` (there is main file that connects all other scss filed. do not edit it)

`index.html` (main html file)

How write `html` code
=============

We have main html file
`/app/index.html`

We also can create other html files
`/app/otherfile.html` 

And create folders for html files
`/app/folder/index.html` 

We are also using simplest include system with `gulp-include`, works for javascrpt, html and sass:
`<!--=include _template/footer.html  -->` 

We have html template folder with templates (like header or footer ect.)
`/app/_template/footer.html` 


How create `sprite` image
=============

`app/img/sprite` are joined into sprite, which could be used in Sass like this:
```
.icon
    +s(png_name)
```

Naming
=============
I use BEM naming, meaning `.block` for independent block. `.block__element` for elements inside that block. And `.block_modification` for modification of the block.

It's noce to name layout blocks with `.l-*` prefixes. So you know it's layout.

States of the blocks use prefix `.is-*`. `.is-running`, `.is-hidden`, `.is-open`.

For javascript hooks we use prefix `.js-*`.

You are welcome
=============
Have fun using it, or borrowing some parts. In case of issues or ideas just create them on github. Or write me at <a href="mailto:helengaiuk@qp-link.com">helengaiuk@qp-link.com</a>.
