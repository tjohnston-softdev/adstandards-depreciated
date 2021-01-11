DROP DATABASE IF EXISTS adstandardsArchive;
CREATE DATABASE IF NOT EXISTS adstandardsArchive;

ALTER DATABASE adstandardsArchive
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

USE adstandardsArchive;


CREATE TABLE Advertiser
(
	advertiserID				INT				PRIMARY KEY				AUTO_INCREMENT,
	advertiserName				VARCHAR(400)	UNIQUE NOT NULL,
	activeFlag					TINYINT(1)		NOT NULL				DEFAULT 1
);


CREATE TABLE ProductCategory
(
	productCategoryID			SMALLINT		PRIMARY KEY				AUTO_INCREMENT,
	productCategoryName			VARCHAR(120)	UNIQUE NOT NULL,
	activeFlag					TINYINT(1)		NOT NULL				DEFAULT 1
);


CREATE TABLE MediaType
(
	mediaTypeID					SMALLINT		PRIMARY KEY				AUTO_INCREMENT,
	mediaTypeName				VARCHAR(200)	UNIQUE NOT NULL,
	activeFlag					TINYINT(1)		NOT NULL				DEFAULT 1
);




CREATE TABLE CaseFile
(
	caseEntryID					INT				PRIMARY KEY				AUTO_INCREMENT,
	caseCode					VARCHAR(100)	UNIQUE NOT NULL,
	advertiserID				INT,
	descriptionText				VARCHAR(3000),
	determinationFlag			TINYINT,
	productCategoryID			SMALLINT,
	mediaTypeID					SMALLINT,
	determinationDate			DATE,
	archiveTimestamp			DATETIME		NOT NULL				DEFAULT NOW(),
	documentFileURL				VARCHAR(250)	UNIQUE,
	downloadFlag				TINYINT(1)		NOT NULL				DEFAULT 1,
	activeFlag					TINYINT(1)		NOT NULL				DEFAULT 1,
	FOREIGN KEY (advertiserID) REFERENCES Advertiser(advertiserID) ON UPDATE CASCADE ON DELETE SET NULL,
	FOREIGN KEY (productCategoryID) REFERENCES ProductCategory(productCategoryID) ON UPDATE CASCADE ON DELETE SET NULL,
	FOREIGN KEY (mediaTypeID) REFERENCES MediaType(mediaTypeID) ON UPDATE CASCADE ON DELETE SET NULL
);