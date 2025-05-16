-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2025 at 08:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vcd`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add custom user', 7, 'add_customuser'),
(26, 'Can change custom user', 7, 'change_customuser'),
(27, 'Can delete custom user', 7, 'delete_customuser'),
(28, 'Can view custom user', 7, 'view_customuser'),
(29, 'Can add car log', 8, 'add_carlog'),
(30, 'Can change car log', 8, 'change_carlog'),
(31, 'Can delete car log', 8, 'delete_carlog'),
(32, 'Can view car log', 8, 'view_carlog'),
(33, 'Can add boomsig', 9, 'add_boomsig'),
(34, 'Can change boomsig', 9, 'change_boomsig'),
(35, 'Can delete boomsig', 9, 'delete_boomsig'),
(36, 'Can view boomsig', 9, 'view_boomsig'),
(37, 'Can add barrier open log', 10, 'add_barrieropenlog'),
(38, 'Can change barrier open log', 10, 'change_barrieropenlog'),
(39, 'Can delete barrier open log', 10, 'delete_barrieropenlog'),
(40, 'Can view barrier open log', 10, 'view_barrieropenlog');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `barrieropenlog`
--

CREATE TABLE `barrieropenlog` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `boom_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barrieropenlog`
--

INSERT INTO `barrieropenlog` (`id`, `created_at`, `updated_at`, `boom_id`) VALUES
(1, '2025-03-05 07:01:16.715788', '2025-03-05 07:01:16.715788', 1),
(2, '2025-03-05 07:02:22.705189', '2025-03-05 07:02:22.705189', 1),
(3, '2025-03-05 07:08:05.436541', '2025-03-05 07:08:05.436541', 1);

-- --------------------------------------------------------

--
-- Table structure for table `boomsig`
--

CREATE TABLE `boomsig` (
  `id` int(11) NOT NULL,
  `entryboom` varchar(1) NOT NULL,
  `entrysynctime` datetime(6) NOT NULL,
  `exitboom` varchar(1) NOT NULL,
  `exitsynctime` datetime(6) NOT NULL,
  `barrier_open_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `boomsig`
--

INSERT INTO `boomsig` (`id`, `entryboom`, `entrysynctime`, `exitboom`, `exitsynctime`, `barrier_open_count`) VALUES
(1, 'N', '2025-03-05 07:08:05.431542', 'N', '2025-03-05 12:30:14.000000', 4),
(2, 'N', '2025-03-05 12:30:43.000000', 'N', '2025-03-05 12:30:43.000000', 1),
(3, 'N', '2025-03-05 12:30:52.000000', 'N', '2025-03-05 12:30:52.000000', 1);

-- --------------------------------------------------------

--
-- Table structure for table `custom_users`
--

CREATE TABLE `custom_users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dashboard_carlog`
--

CREATE TABLE `dashboard_carlog` (
  `id` int(11) NOT NULL,
  `gate` varchar(64) NOT NULL,
  `action` varchar(64) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dashboard_carlog`
--

INSERT INTO `dashboard_carlog` (`id`, `gate`, `action`, `created_at`, `updated_at`) VALUES
(1, '1', 'entry', '2025-03-05 09:54:06.374579', '2025-03-05 09:54:06.374579'),
(2, '2', 'entry', '2025-03-05 10:23:18.807882', '2025-03-05 10:23:18.807882'),
(3, '2', 'entry', '2025-03-05 17:47:51.000000', '2025-03-05 17:47:51.000000'),
(4, '1', 'entry', '2025-03-06 09:45:57.000000', '2025-03-06 09:45:57.000000'),
(5, '1', 'entry', '2025-03-10 15:06:04.000000', '2025-03-10 15:06:04.000000'),
(6, '1', 'entry', '2025-03-10 15:16:54.000000', '2025-03-10 15:16:54.000000');

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(7, 'accounts', 'customuser'),
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(10, 'dashboard', 'barrieropenlog'),
(9, 'dashboard', 'boomsig'),
(8, 'dashboard', 'carlog'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'accounts', '0001_initial', '2025-03-05 06:57:34.821534'),
(2, 'accounts', '0002_remove_customuser_last_login_alter_customuser_table', '2025-03-05 06:57:34.857996'),
(3, 'accounts', '0003_customuser_last_login', '2025-03-05 06:57:34.883304'),
(4, 'contenttypes', '0001_initial', '2025-03-05 06:57:34.924950'),
(5, 'auth', '0001_initial', '2025-03-05 06:57:35.768666'),
(6, 'admin', '0001_initial', '2025-03-05 06:57:35.967739'),
(7, 'admin', '0002_logentry_remove_auto_add', '2025-03-05 06:57:35.988123'),
(8, 'admin', '0003_logentry_add_action_flag_choices', '2025-03-05 06:57:36.009396'),
(9, 'contenttypes', '0002_remove_content_type_name', '2025-03-05 06:57:36.096763'),
(10, 'auth', '0002_alter_permission_name_max_length', '2025-03-05 06:57:36.181081'),
(11, 'auth', '0003_alter_user_email_max_length', '2025-03-05 06:57:36.196707'),
(12, 'auth', '0004_alter_user_username_opts', '2025-03-05 06:57:36.220864'),
(13, 'auth', '0005_alter_user_last_login_null', '2025-03-05 06:57:36.290197'),
(14, 'auth', '0006_require_contenttypes_0002', '2025-03-05 06:57:36.290197'),
(15, 'auth', '0007_alter_validators_add_error_messages', '2025-03-05 06:57:36.308520'),
(16, 'auth', '0008_alter_user_username_max_length', '2025-03-05 06:57:36.331187'),
(17, 'auth', '0009_alter_user_last_name_max_length', '2025-03-05 06:57:36.351145'),
(18, 'auth', '0010_alter_group_name_max_length', '2025-03-05 06:57:36.368646'),
(19, 'auth', '0011_update_proxy_permissions', '2025-03-05 06:57:36.384384'),
(20, 'auth', '0012_alter_user_first_name_max_length', '2025-03-05 06:57:36.404798'),
(21, 'dashboard', '0001_initial', '2025-03-05 06:57:36.433452'),
(22, 'dashboard', '0002_alter_anpr_plate', '2025-03-05 06:57:36.497404'),
(23, 'dashboard', '0003_delete_anpr', '2025-03-05 06:57:36.513283'),
(24, 'dashboard', '0004_carlog', '2025-03-05 06:57:36.554115'),
(25, 'dashboard', '0005_boomsig', '2025-03-05 06:57:36.582878'),
(26, 'dashboard', '0006_boomsig_barrier_open_count', '2025-03-05 06:57:36.613774'),
(27, 'dashboard', '0007_barrieropenlog', '2025-03-05 06:57:36.721229'),
(28, 'sessions', '0001_initial', '2025-03-05 06:57:36.765213');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `barrieropenlog`
--
ALTER TABLE `barrieropenlog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barrieropenlog_boom_id_bdec5cce_fk_boomsig_id` (`boom_id`);

--
-- Indexes for table `boomsig`
--
ALTER TABLE `boomsig`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `custom_users`
--
ALTER TABLE `custom_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `dashboard_carlog`
--
ALTER TABLE `dashboard_carlog`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `barrieropenlog`
--
ALTER TABLE `barrieropenlog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `boomsig`
--
ALTER TABLE `boomsig`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `custom_users`
--
ALTER TABLE `custom_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dashboard_carlog`
--
ALTER TABLE `dashboard_carlog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `barrieropenlog`
--
ALTER TABLE `barrieropenlog`
  ADD CONSTRAINT `barrieropenlog_boom_id_bdec5cce_fk_boomsig_id` FOREIGN KEY (`boom_id`) REFERENCES `boomsig` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
