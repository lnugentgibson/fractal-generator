.DEFAULT_GOAL := all

Components := $(patsubst %,oa-%,util validator blender-input linear-algebra sylvester webgl-helpers mesh gl-noise blender-view vector-picker fractal-generator)

LibraryComponents := $(patsubst %,oa-%,util validator linear-algebra sylvester webgl-helpers mesh gl-noise)

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
	npx babel @< --out-file $@

appscripts: $(AppScripts)

$(AppTemplates): %.html: %.haml
	haml @< $@

templates: $(AppTemplates)

$(AppStyles): %.css: %.scss
	npx sass @< $@

appstyles: $(AppStyles)

$(AppBodies): %.html: %.haml
	haml @< $@

appbodies: $(AppBodies)

$(AppContainers): %.html: %.haml %.app.html %.templates.html %.css %.js
	haml @< $(patsubst %.html,%.tmp1.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp1.html,$@) > $(patsubst %.html,%.tmp2.html,$@)
	awk '/###temp###/ { system ( "cat $(patsubst %.html,%.templates.html,$@)" ) } !/###temp###/ { print; }' $(patsubst %.html,%.tmp2.html,$@) > $@

appcontainers: $(AppContainers)

$(CheckScripts): %.js: %.es6
	npx babel @< --out-file $@

checkscripts: $(CheckScripts)

$(CheckStyles): %.css: %.scss
	npx sass @< $@

checkstyles: $(CheckStyles)

$(CheckBodies): %.html: %.haml
	haml @< $@

checkbodies: $(CheckBodies)

$(CheckLibraryContainers): %.html: %.haml %.app.html %.templates.html %.css %.js
	haml @< $(patsubst %.html,%.tmp.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp.html,$@) > $@
	rm $(patsubst %.html,%.tmp.html,$@)

$(CheckAppContainers): %.html: %.haml %.app.html %.templates.html %.css %.js
	haml @< $(patsubst %.html,%.tmp1.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp1.html,$@) > $(patsubst %.html,%.tmp2.html,$@)
	awk '/###temp###/ { system ( "cat $(patsubst %.html,%.templates.html,$@)" ) } !/###temp###/ { print; }' $(patsubst %.html,%.tmp2.html,$@) > $@
	rm $(patsubst %.html,%.tmp1.html,$@) $(patsubst %.html,%.tmp2.html,$@)

checkcontainers: $(CheckLibraryContainers) $(CheckAppContainers)

$(DemoScripts): %.js: %.es6
	npx babel @< --out-file $@

demoscripts: $(DemoScripts)

$(DemoStyles): %.css: %.scss
	npx sass @< $@

demostyles: $(DemoStyles)

$(DemoBodies): %.html: %.haml
	haml @< $@

demobodies: $(DemoBodies)

$(DemoLibraryContainers): %.html: %.haml %.app.html %.templates.html %.css %.js
	haml @< $(patsubst %.html,%.tmp.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp.html,$@) > $@
	rm $(patsubst %.html,%.tmp.html,$@)

$(DemoAppContainers): %.html: %.haml %.app.html %.templates.html %.css %.js
	haml @< $(patsubst %.html,%.tmp1.html,$@)
	awk '/###body###/ { system ( "cat $(patsubst %.html,%.app.html,$@)" ) } !/###body###/ { print; }' $(patsubst %.html,%.tmp1.html,$@) > $(patsubst %.html,%.tmp2.html,$@)
	awk '/###temp###/ { system ( "cat $(patsubst %.html,%.templates.html,$@)" ) } !/###temp###/ { print; }' $(patsubst %.html,%.tmp2.html,$@) > $@
	rm $(patsubst %.html,%.tmp1.html,$@) $(patsubst %.html,%.tmp2.html,$@)

democontainers: $(DemoLibraryContainers) $(DemoAppContainers)

scripts: appscripts checkscripts demoscripts

styles: appstyles checkstyles demostyles

bodies: appbodies checkbodies demobodies

containers: appcontainers checkcontainers democontainers

all: containers