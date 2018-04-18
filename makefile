.DEFAULT_GOAL := all

Components := $(patsubst %,oa-%,util validator blender-input math linear-algebra sylvester object webgl-helpers mesh gl-noise blender-view vector-picker fractal-generator)

LibraryComponents := $(patsubst %,oa-%,util validator math linear-algebra sylvester object webgl-helpers mesh gl-noise)

AppComponents := $(patsubst %,oa-%,blender-input blender-view vector-picker fractal-generator)

AppScripts := $(patsubst %,%.js,$(Components))
AppMinScripts := $(patsubst %,%.min.js,$(Components))
TestScripts := $(patsubst %,%.test.js,$(Components))
TestMinScripts := $(patsubst %,%.test.min.js,$(Components))
Tests := $(patsubst %,test-%,$(Components))
AppTemplates := $(patsubst %,%.templates.html,$(AppComponents))
AppStyles := $(patsubst %,%.css,$(AppComponents))
AppMinStyles := $(patsubst %,%.min.css,$(Components))
AppBodies := $(patsubst %,%.app.html,$(AppComponents))
AppContainers := $(patsubst %,%.html,$(AppComponents))
CheckScripts := $(patsubst %,%.check.js,$(Components))
CheckMinScripts := $(patsubst %,%.check.min.js,$(Components))
CheckStyles := $(patsubst %,%.check.css,$(Components))
CheckMinStyles := $(patsubst %,%.check.min.css,$(Components))
CheckBodies := $(patsubst %,%.check.app.html,$(Components))
CheckLibraryContainers := $(patsubst %,%.check.html,$(LibraryComponents))
CheckAppContainers := $(patsubst %,%.check.html,$(AppComponents))
DemoScripts := $(patsubst %,%.demo.js,$(Components))
DemoMinScripts := $(patsubst %,%.demo.min.js,$(Components))
DemoStyles := $(patsubst %,%.demo.css,$(Components))
DemoMinStyles := $(patsubst %,%.demo.min.css,$(Components))
DemoBodies := $(patsubst %,%.demo.app.html,$(Components))
DemoLibraryContainers := $(patsubst %,%.demo.html,$(LibraryComponents))
DemoAppContainers := $(patsubst %,%.demo.html,$(AppComponents))

$(AppScripts): %.js: %.es6
	npx babel $< --out-file $@

appscripts: $(AppScripts)

$(AppMinScripts): %.min.js: %.js
	uglify -s $< -o $@

appminscripts: $(AppMinScripts)

$(TestScripts): %.js: %.es6
	npx babel $< --out-file $@

testscripts: $(TestScripts)

$(TestMinScripts): %.min.js: %.js
	uglify -s $< -o $@

testminscripts: $(TestMinScripts)

$(Tests): test-%: %.test.js %.js
	mocha $<

test: $(TestScripts) $(AppScripts)
	mocha $(TestScripts)

$(AppTemplates): %.html: %.haml
	haml $< $@

templates: $(AppTemplates)

$(AppStyles): %.css: %.scss
	npx sass $< $@

$(AppMinStyles): %.min.css: %.css
	uglify -s $< -o $@ -c

appstyles: $(AppStyles)

$(AppBodies): %.html: %.haml
	haml $< $@

appbodies: $(AppBodies)

$(AppContainers): %.html: %.haml %.app.html %.templates.html %.min.css %.min.js
	haml $< $(patsubst %.html,%.tmp1.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp1.html,$@) > $(patsubst %.html,%.tmp2.html,$@)
	awk '/###temp###/ { system ( "cat $(patsubst %.html,%.templates.html,$@)" ) } !/###temp###/ { print; }' $(patsubst %.html,%.tmp2.html,$@) > $@
	rm $(patsubst %.html,%.tmp1.html,$@) $(patsubst %.html,%.tmp2.html,$@)

appcontainers: $(AppContainers)

$(CheckScripts): %.check.js: %.check.es6 %.js
	npx babel $< --out-file $@

checkscripts: $(CheckScripts)

$(CheckMinScripts): %.min.js: %.js
	uglify -s $< -o $@

checkminscripts: $(CheckMinScripts)

$(CheckStyles): %.css: %.scss
	npx sass $< $@

checkstyles: $(CheckStyles)

$(CheckMinStyles): %.min.css: %.css
	uglify -s $< -o $@ -c

checkminstyles: $(CheckMinStyles)

$(CheckBodies): %.html: %.haml
	haml $< $@

checkbodies: $(CheckBodies)

$(CheckLibraryContainers): %.check.html: %.check.haml %.check.app.html %.check.min.css %.check.min.js %.min.js
	haml $< $(patsubst %.html,%.tmp.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp.html,$@) > $@
	rm $(patsubst %.html,%.tmp.html,$@)

$(CheckAppContainers): %.check.html: %.check.haml %.check.app.html %.templates.html %.check.min.css %.check.min.js %.min.css %.min.js
	haml $< $(patsubst %.html,%.tmp1.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp1.html,$@) > $(patsubst %.html,%.tmp2.html,$@)
	awk '/###temp###/ { system ( "cat $(patsubst %.check.html,%.templates.html,$@)" ) } !/###temp###/ { print; }' $(patsubst %.html,%.tmp2.html,$@) > $@
	rm $(patsubst %.html,%.tmp1.html,$@) $(patsubst %.html,%.tmp2.html,$@)

checkcontainers: $(CheckLibraryContainers) $(CheckAppContainers)

$(DemoScripts): %.demo.js: %.demo.es6 %.js
	npx babel $< --out-file $@

demoscripts: $(DemoScripts)

$(DemoMinScripts): %.min.js: %.js
	uglify -s $< -o $@

demominscripts: $(DemoMinScripts)

$(DemoStyles): %.css: %.scss
	npx sass $< $@

demostyles: $(DemoStyles)

$(DemoMinStyles): %.min.css: %.css
	uglify -s $< -o $@ -c

demominstyles: $(DemoMinStyles)

$(DemoBodies): %.html: %.haml
	haml $< $@

demobodies: $(DemoBodies)

$(DemoLibraryContainers): %.demo.html: %.demo.haml %.demo.app.html %.demo.min.css %.demo.min.js %.min.js
	haml $< $(patsubst %.html,%.tmp.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp.html,$@) > $@
	rm $(patsubst %.html,%.tmp.html,$@)

$(DemoAppContainers): %.demo.html: %.demo.haml %.demo.app.html %.templates.html %.demo.min.css %.demo.min.js %.min.css %.min.js
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


oa-validator.check.html oa-validator.demo.html: oa-util.js
oa-blender-input.check.html oa-blender-input.demo.html: oa-validator.js
oa-linear-algebra.check.html oa-linear-algebra.demo.html: oa-util.js
oa-sylvester.check.html oa-sylvester.demo.html: oa-util.js
oa-webgl-helpers.check.html oa-webgl-helpers.demo.html: oa-object.js
oa-mesh.check.html oa-mesh.demo.html: oa-linear-algebra.js oa-sylvester.js
oa-gl-noise.check.html oa-gl-noise.demo.html: oa-webgl-helpers.js
oa-blender-view.check.html oa-blender-view.demo.html: oa-mesh.js oa-webgl-helpers.js
oa-vector-picker.check.html oa-vector-picker.demo.html: oa-blender-input.js oa-blender-input.css oa-blender-view.js oa-blender-view.css
oa-fractal-generator.check.html oa-fractal-generator.demo.html: oa-vector-picker.js oa-vector-picker.css