# ScKIM_D3

Static AWS-hostable browser solution for scRNA-seq and spatial transcriptomics.

The goal is to use [D3FC](https://github.com/d3fc/d3fc) GPU-accelerated drawing and data streaming, drawing from data science visualization examples [here](https://github.com/ColinEberhardt/d3fc-webgl-hathi-explorer) and [here](https://github.com/chrisprice/d3fc-webgl-hathi-explorer) to speed up presentation of 1M+ cells/spatial spots, and still achieving lowest entry and sharing threshold possible - a link in the browser without any additional software installations or dataset downloads.

# Current working examples (AWS)

[33k cells](https://rfd3test.s3.us-west-2.amazonaws.com/v2/index.html)

[1.3m cells](https://rfd3test.s3.us-west-2.amazonaws.com/v3/index.html)

[10x Spatial Transcriptomics](https://rfd3test.s3.us-west-2.amazonaws.com/st_1/index.html)

# Current working examples (local)

Git clone the repo and open `index.html`. May need additional settings:
```
# macOS
open -a "Google Chrome" --args --allow-file-access-from-files
# linux 
/usr/bin/chromium-browser --allow-file-access-from-files
# windows
add --allow-file-access-from-files to properties
```

# Comparison to other browser solutions

| Consideration | ScKIM_D3 | cellBrowser | cellXgene | R shiny solutions | 10x Loupe |
|:--------|:--------|:--------|:--------|:--------|:--------|
| Web access | ✓ | ✓ | ✓ | ✓ | x |
| Amazon Cloud deployment | ✓ | ✓ | x | x | x |
| Spatial information | ✓ | x | ✓ | ✓ | ✓ |
| Custom data | ✓ | ✓ | ✓ | ✓ | x |
| Giant datasets | ✓ | ✓ | ✓ | x | ✓ |
| Differential expression analysis | x | x | ✓ | ✓ | ✓ |

