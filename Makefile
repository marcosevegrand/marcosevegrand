LATEX ?= lualatex
CV_DIR := static/cv
CV_TEX := $(CV_DIR)/main.tex
CV_PDF := $(CV_DIR)/cv.pdf
CV_AUX := $(CV_DIR)/cv.aux $(CV_DIR)/cv.log $(CV_DIR)/cv.out $(CV_DIR)/cv.toc $(CV_DIR)/cv.fls $(CV_DIR)/cv.fdb_latexmk $(CV_DIR)/cv.synctex.gz

.PHONY: cv clean

cv: $(CV_PDF)

$(CV_PDF): $(CV_TEX)
	$(LATEX) -interaction=nonstopmode -halt-on-error -file-line-error -jobname=cv -output-directory=$(CV_DIR) $(CV_TEX)
	$(LATEX) -interaction=nonstopmode -halt-on-error -file-line-error -jobname=cv -output-directory=$(CV_DIR) $(CV_TEX)

clean:
	rm -f $(CV_AUX)