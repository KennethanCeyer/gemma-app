<p align="center"><img src="./src/assets/gemma.svg" width="200" /></p>
<h1>Gemma App</h1>

## Installation

Install Javascript dependencies.

```bash
yarn
```

Download Gemma 1.1 GPU instruct 4-bit quantized model from Kaggle.

https://www.kaggle.com/models/google/gemma/tfLite/gemma-1.1-2b-it-gpu-int4

Put your `gemma-1.1-2b-it-gpu-int4.bin` file to `public/` directory.

Your file structure in `public/` should be looks like as the belows:


```plaintext
tree -L 2 public/

# OUTUT:
# public
# ├── gemma-1.1-2b-it-gpu-int4.bin
# ├── index.html
# ├── manifest.json
# └── robots.txt
```

## How to start

```bash
yarn start
```
