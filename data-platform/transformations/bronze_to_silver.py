import sys
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, current_timestamp, sha2

def transform_bronze_to_silver(bronze_path, silver_path):
    spark = SparkSession.builder \
        .appName("BronzeToSilverTransform") \
        .getOrCreate()

    # Load raw Bronze data (Delta)
    bronze_df = spark.read.format("delta").load(bronze_path)

    # Apply transformations:
    # 1. De-duplicate
    # 2. PII Masking (SHA2 hashing for example)
    # 3. Add processing audit columns
    silver_df = bronze_df.dropDuplicates(["id"]) \
        .withColumn("email_masked", sha2(col("email"), 256)) \
        .withColumn("processed_at", current_timestamp())

    # Write to Silver layer (Delta) with schema enforcement
    silver_df.write.format("delta") \
        .mode("overwrite") \
        .option("mergeSchema", "true") \
        .save(silver_path)

    spark.stop()

if __name__ == "__main__":
    # Example paths
    TRANSFORM_BRONZE = "s3://lakehouse-bucket/bronze/customers"
    TRANSFORM_SILVER = "s3://lakehouse-bucket/silver/customers"
    
    transform_bronze_to_silver(TRANSFORM_BRONZE, TRANSFORM_SILVER)
