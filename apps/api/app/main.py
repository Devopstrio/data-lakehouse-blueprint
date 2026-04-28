import logging
import time
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app
from pythonjsonlogger import jsonlogger

# Logger setup
logger = logging.getLogger("lakehouse-api")
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

app = FastAPI(title="Data Lakehouse Blueprint API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"Path: {request.url.path} Duration: {duration:.4f}s Status: {response.status_code}")
    return response

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/pipelines/status")
def get_pipelines_status():
    return [
        {"id": "ingest-sap-erp", "name": "SAP ERP Ingestion", "status": "SUCCESS", "freshness": "4.2m"},
        {"id": "silver-customers", "name": "Silver Customer Transform", "status": "RUNNING", "freshness": "1.2h"},
        {"id": "gold-revenue-agg", "name": "Gold Revenue Aggregation", "status": "SUCCESS", "freshness": "24h"}
    ]

@app.get("/catalog/assets")
def get_catalog_assets():
    return {
        "bronze_tables": 450,
        "silver_tables": 280,
        "gold_tables": 45,
        "certified_products": 12
    }

@app.get("/dashboard/summary")
def get_dashboard_summary():
    return {
        "total_data_managed": "4.2 PB",
        "pipeline_success_rate": "99.4%",
        "avg_query_latency": "1.8s",
        "monthly_platform_cost": "$12,450"
    }

@app.post("/pipelines/run")
def run_pipeline(pipeline_id: str):
    logger.info(f"Triggering pipeline execution: {pipeline_id}")
    return {"status": "Job Submitted", "run_id": "job_123456"}
