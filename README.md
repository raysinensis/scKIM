# ScKIM_D3
AWS-hostable browser solution for scRNA-seq and spatial transcriptomics.

The goal is to use [D3FC](https://github.com/d3fc/d3fc) and stream loading code from [Apache Arrow](https://github.com/ColinEberhardt/d3fc-webgl-hathi-explorer) to speed up presentation of 1M+ cells/spatial spots, and still achieving lowest entry and sharing threshold possible - a link in the browser without any additional software installations or dataset downloads.

Current working example at:
https://rfd3test.s3.us-west-2.amazonaws.com/v2/index.html (33k cells)
https://rfd3test.s3.us-west-2.amazonaws.com/v3/index.html (1.3m cells)

| Consideration | ScKIM_D3 | cellBrowser | cellXgene | loupe | R shiny solutions |
|:--------|:--------|:--------|:--------|:--------|:--------|
| Web access | ✓ | ✓ | ✓ | x | ✓ |
| Amazon Cloud deployment | ✓ | ✓ | x | x | x |
| Spatial data support | ✓ | x | ✓ | ✓ | ✓ |
| Differential expression analysis | x | x | ✓ | ✓ | ✓ |
