provider "azurerm" {
  features {}
}

provider "aws" {
  region = var.aws_region
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location
}

# Azure Data Lake Storage Gen2 (Medallion Layers)
resource "azurerm_storage_account" "lakehouse" {
  name                     = "st${var.project_name}${var.environment}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  is_hns_enabled           = true # Critical for Lakehouse performance
}

resource "azurerm_storage_data_lake_gen2_filesystem" "layers" {
  for_each           = toset(["bronze", "silver", "gold"])
  name               = each.key
  storage_account_id = azurerm_storage_account.lakehouse.id
}

# Databricks Workspace (Lakehouse Engine)
resource "azurerm_databricks_workspace" "analytics" {
  name                = "dbw-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "premium"
}

# AWS S3 Bucket (Secondary Cloud / DR Layer)
resource "aws_s3_bucket" "lakehouse_dr" {
  bucket = "lakehouse-dr-${var.project_name}-${var.environment}"
}

# AWS Glue Data Catalog (Cross-Cloud Metadata)
resource "aws_glue_catalog_database" "governance" {
  name = "lakehouse_metadata"
}
