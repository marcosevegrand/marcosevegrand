.PHONY: serve build new clean

serve:
	hugo server -D

build:
	hugo --gc --minify --cleanDestinationDir

new:
	@test -n "$(title)" || { echo "usage: make new title='My Post Title'"; exit 1; }
	hugo new "posts/$(title).md"

clean:
	rm -rf public/ resources/
