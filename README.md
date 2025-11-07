3D Wildfire Defensible Space Analyzer

This project is an end-to-end solution for assessing wildfire risk by analyzing 3D data captured from drones. It demonstrates a full-stack MLOps workflow, from "zero-shot" model prototyping to fine-tuning a "closed-set" model, including 3D data processing and interactive web visualization.

### Full Project Plan (Notion)

A detailed project roadmap and task board are maintained on our public Notion page:
**[View the Full Project Plan on Notion](https://www.notion.so/3D-Wildfire-Defensible-Space-Analyzer-2a3ed8d60a0780e79b9ed60b7f21a8a5)**

---

## Final Result: Interactive 3D Risk Analysis

The final product is an interactive 3D point cloud that automatically classifies risk zones. This model can be rotated and explored directly in a web browser using **Three.js**.

> **![danger.gif](danger.gif)**
>
> *This 3D model (rendered via Three.js) displays:*
> * <span style="color:blue">**Structures (Blue)**</span>
> * <span style="color:green">**Safe Vegetation (Green)**</span>
> * <span style="color:red">**High-Risk Vegetation (Red)**</span> — *vegetation within a 5-meter 3D radius of a structure.*

---

## Technology Stack

* **Core:** Python, PyTorch, Jupyter
* **AI / ML:**
    * **Open-Set (Prototyping):** Grounding-DINO + Segment Anything (SAM)
    * **Closed-Set (Production):** YOLOv8-Seg (Fine-tuning)
    * **3D Analytics:** `scipy.spatial.KDTree` (for high-speed 3D proximity search)
* **Geospatial:** `rasterio` (for reading DSM/DTM `.tif` files)
* **Visualization:** `supervision`, `matplotlib`, `plotly`
* **Web / 3D:** **Three.js** (for interactive `.ply` rendering)
* **Environment:** `uv` (as a high-speed package manager)

---

## Project Workflow (4-Stage Pipeline)

The project is segmented into four sequential Jupyter Notebooks, demonstrating a complete ML product development lifecycle.

### Stage 1: 2D Segmentation (Zero-Shot)
**Notebook:** `01_2D_Segmentation.ipynb`

* **Goal:** Rapidly prototype and validate the detection hypothesis using SOTA zero-shot models.
* **Process:** Utilizes **Grounding-DINO** (with "tree", "house" text prompts) and **SAM** to generate precise 2D segmentation masks from the orthophoto (`test_image.tif`).
* **Result:** A 2D image with identified objects.

>
> *Output of the GroundingDINO + SAM pipeline, visualized with `supervision`.*

### Stage 2: 3D Integration and Visualization
**Notebook:** `02_3D_Integration.ipynb`

* **Goal:** Transform the 2D data into a 3D scene.
* **Process:** Overlays the 2D masks (from Stage 1) onto the **DSM** (Digital Surface Model) height map (`test_dsm.tif`). Each pixel is now assigned `(X, Y, Z)` coordinates and `(R, G, B)` color.
* **Result:** Exports `point_cloud.ply`, a 3D model with **true-color** data.

> ![index.gif](index.gif)
> *The same scene rendered in 3D with its original RGB colors, visualized in Three.js.*

### Stage 3: 3D Risk Analysis
**Notebook:** `03_Risk_Analysis.ipynb`

* **Goal:** Execute the core business logic—finding high-risk zones.
* **Process:** Employs `scipy.KDTree` for highly efficient 3D spatial queries. It identifies all "tree" points within a `5.0`-meter 3D radius of any "house" point.
* **Result:** Exports `danger_point_cloud.ply`, a new 3D model **color-coded by risk level**. (This is the GIF shown at the top).


### Stage 4: Fine-Tuning (Production Transition)
**Notebook:** `04_Finetuning.ipynb`

* **Goal:** Demonstrate the transition from a slow "open-set" prototype to a fast, production-ready "closed-set" model.
* **Process:** Uses the results from Stage 1 as a "pilot dataset." Converts SAM masks to YOLO polygon format, creates a `data.yaml`, and fine-tunes a `YOLOv8n-Seg` model.
* **Result:** A custom, high-speed `best.pt` model that identifies "tree" and "house" **without** text prompts or the SAM model.

>
> *Inference results from the custom-trained YOLOv8-Seg model.*

---

## Getting Started

### Step 1: Environment Setup

This project **requires Python 3.12** or lower (due to PyTorch compatibility).

```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/3d-wildfire-risk-analyzer.git](https://github.com/YOUR_USERNAME/3d-wildfire-risk-analyzer.git)
cd 3d-wildfire-risk-analyzer

# 2. Create the virtual environment (forcing Python 3.12)
uv venv --python 3.12

# 3. Activate the environment
# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# 4. Install PyTorch (for CUDA 12.1 - adjust for your hardware)
uv pip install torch torchvision --index-url [https://download.pytorch.org/whl/cu121](https://download.pytorch.org/whl/cu121)

# 5. Install all other dependencies
uv pip install -r requirements.txt