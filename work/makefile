.DEFAULT_GOAL := all

Components := $(patsubst %,oa-%,util validator blender-input math linear-algebra sylvester webgl-helpers mesh gl-noise blender-view vector-picker fractal-generator)

LibraryComponents := $(patsubst %,oa-%,util validator math linear-algebra sylvester webgl-helpers mesh gl-noise)

AppComponents := $(patsubst %,oa-%,blender-input blender-view vector-picker fractal-generator)

AppScripts := $(patsubst %,%.js,$(Components))
AppTemplates := $(patsubst %,%.templates.html,$(AppComponents))
AppStyles := $(patsubst %,%.css,$(AppComponents))
AppBodies := $(patsubst %,%.app.html,$(AppComponents))
AppContainers := $(patsubst %,%.html,$(AppComponents))
CheckScripts := $(patsubst %,%.check.js,$(Components))
CheckStyles := $(patsubst %,%.check.css,$(Components))
CheckBodies := $(patsubst %,%.check.app.html,$(Components))
CheckLibraryContainers := $(patsubst %,%.check.html,$(LibraryComponents))
CheckAppContainers := $(patsubst %,%.check.html,$(AppComponents))
DemoScripts := $(patsubst %,%.demo.js,$(Components))
DemoStyles := $(patsubst %,%.demo.css,$(Components))
DemoBodies := $(patsubst %,%.demo.app.html,$(Components))
DemoLibraryContainers := $(patsubst %,%.demo.html,$(LibraryComponents))
DemoAppContainers := $(patsubst %,%.demo.html,$(AppComponents))

$(AppScripts): %.js: %.es6
	npx babel $< --out-file $@

appscripts: $(AppScripts)

$(AppTemplates): %.html: %.haml
	haml $< $@

templates: $(AppTemplates)

$(AppStyles): %.css: %.scss
	npx sass $< $@

appstyles: $(AppStyles)

$(AppBodies): %.html: %.haml
	haml $< $@

appbodies: $(AppBodies)

$(AppContainers): %.html: %.haml %.app.html %.templates.html %.css %.js
	haml $< $(patsubst %.html,%.tmp1.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp1.html,$@) > $(patsubst %.html,%.tmp2.html,$@)
	awk '/###temp###/ { system ( "cat $(patsubst %.html,%.templates.html,$@)" ) } !/###temp###/ { print; }' $(patsubst %.html,%.tmp2.html,$@) > $@
	rm $(patsubst %.html,%.tmp1.html,$@) $(patsubst %.html,%.tmp2.html,$@)

appcontainers: $(AppContainers)

$(CheckScripts): %.check.js: %.check.es6 %.js
	npx babel $< --out-file $@

checkscripts: $(CheckScripts)

$(CheckStyles): %.css: %.scss
	npx sass $< $@

checkstyles: $(CheckStyles)

$(CheckBodies): %.html: %.haml
	haml $< $@

checkbodies: $(CheckBodies)

$(CheckLibraryContainers): %.check.html: %.check.haml %.check.app.html %.check.css %.check.js %.js
	haml $< $(patsubst %.html,%.tmp.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp.html,$@) > $@
	rm $(patsubst %.html,%.tmp.html,$@)

$(CheckAppContainers): %.check.html: %.check.haml %.check.app.html %.templates.html %.check.css %.check.js %.css %.js
	haml $< $(patsubst %.html,%.tmp1.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp1.html,$@) > $(patsubst %.html,%.tmp2.html,$@)
	awk '/###temp###/ { system ( "cat $(patsubst %.check.html,%.templates.html,$@)" ) } !/###temp###/ { print; }' $(patsubst %.html,%.tmp2.html,$@) > $@
	rm $(patsubst %.html,%.tmp1.html,$@) $(patsubst %.html,%.tmp2.html,$@)

checkcontainers: $(CheckLibraryContainers) $(CheckAppContainers)

$(DemoScripts): %.demo.js: %.demo.es6 %.js
	npx babel $< --out-file $@

demoscripts: $(DemoScripts)

$(DemoStyles): %.css: %.scss
	npx sass $< $@

demostyles: $(DemoStyles)

$(DemoBodies): %.html: %.haml
	haml $< $@

demobodies: $(DemoBodies)

$(DemoLibraryContainers): %.demo.html: %.demo.haml %.demo.app.html %.demo.css %.demo.js %.js
	haml $< $(patsubst %.html,%.tmp.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp.html,$@) > $@
	rm $(patsubst %.html,%.tmp.html,$@)

$(DemoAppContainers): %.demo.html: %.demo.haml %.demo.app.html %.templates.html %.demo.css %.demo.js %.css %.js
	haml $< $(patsubst %.html,%.tmp1.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp1.html,$@) > $(patsubst %.html,%.tmp2.html,$@)
	awk '/###temp###/ { system ( "cat $(patsubst %.demo.html,%.templates.html,$@)" ) } !/###temp###/ { print; }' $(patsubst %.html,%.tmp2.html,$@) > $@
	rm $(patsubst %.html,%.tmp1.html,$@) $(patsubst %.html,%.tmp2.html,$@)

democontainers: $(DemoLibraryContainers) $(DemoAppContainers)

scripts: appscripts checkscripts demoscripts

styles: appstyles checkstyles demostyles

bodies: appbodies checkbodies demobodies

containers: appcontainers checkcontainers democontainers

all: containers


oa-validator.js: oa-util.js
oa-blender-input.js: oa-validator.js
oa-linear-algebra.js: oa-util.js
oa-sylvester.js: oa-util.js
oa-mesh.js: oa-sylvester.js
oa-gl-noise.js: oa-webgl-helpers.js
#oa-blender-view.js: oa-linear-algebra.js oa-sylvester.js oa-webgl-helpers.js
oa-blender-view.js: oa-mesh.js oa-webgl-helpers.js
oa-vector-picker.js: oa-blender-input.js oa-blender-view.js
oa-fractal-generator.js: oa-vector-picker.js

oa-vector-picker.css: oa-blender-input.css oa-blender-view.css
oa-fractal-generator.css: oa-vector-picker.css