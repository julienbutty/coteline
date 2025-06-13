-- Seed data for Coteline Pro
-- Sample data for development and testing

-- Insert product categories
INSERT INTO product_categories (id, name, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Fenêtres', 'Menuiseries de fenêtres'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Portes', 'Portes d''entrée et intérieures'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Portails', 'Portails et clôtures'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Volets', 'Volets battants et roulants');

-- Insert products
INSERT INTO products (id, name, description, type, category_id, specifications, default_dimensions) VALUES
    ('550e8400-e29b-41d4-a716-446655440005', 'Fenêtre PVC Double Vitrage', 'Fenêtre en PVC avec double vitrage 4/16/4', 'fenetre', '550e8400-e29b-41d4-a716-446655440001', 
     '{"materiaux": ["PVC", "Aluminium"], "couleurs": ["Blanc", "Gris anthracite", "Chêne doré"], "typesVitrage": ["Simple vitrage", "Double vitrage 4/16/4", "Triple vitrage"], "systemeOuverture": ["Oscillo-battant", "Battant", "Coulissant"]}',
     '{"largeurMin": 400, "largeurMax": 2400, "hauteurMin": 400, "hauteurMax": 2400}'),
    ('550e8400-e29b-41d4-a716-446655440006', 'Porte d''entrée Aluminium', 'Porte d''entrée en aluminium avec vitrage', 'porte', '550e8400-e29b-41d4-a716-446655440002',
     '{"materiaux": ["Aluminium", "Bois", "PVC"], "couleurs": ["Blanc", "Gris anthracite", "Noir", "RAL au choix"], "options": ["Vitrage", "Imposte", "Tierce", "Serrure multipoints"]}',
     '{"largeurMin": 800, "largeurMax": 1200, "hauteurMin": 2000, "hauteurMax": 2400}'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Portail Coulissant Aluminium', 'Portail coulissant motorisé en aluminium', 'portail', '550e8400-e29b-41d4-a716-446655440003',
     '{"materiaux": ["Aluminium", "Acier"], "couleurs": ["Gris anthracite", "Blanc", "Noir", "RAL au choix"], "options": ["Motorisation", "Télécommande", "Digicode", "Portillon intégré"]}',
     '{"largeurMin": 3000, "largeurMax": 6000, "hauteurMin": 1500, "hauteurMax": 2000}');

-- Insert sample clients
INSERT INTO clients (id, first_name, last_name, email, phone, company, address_street, address_city, address_postal_code, address_country) VALUES
    ('550e8400-e29b-41d4-a716-446655440010', 'Jean', 'Dupont', 'jean.dupont@email.com', '0123456789', NULL, '12 Rue de la Paix', 'Paris', '75001', 'France'),
    ('550e8400-e29b-41d4-a716-446655440011', 'Marie', 'Martin', 'contact@entreprise-martin.fr', '0987654321', 'Entreprise Martin SARL', '45 Avenue des Champs', 'Lyon', '69000', 'France'),
    ('550e8400-e29b-41d4-a716-446655440012', 'Pierre', 'Moreau', 'p.moreau@gmail.com', '0147258369', NULL, '78 Boulevard Voltaire', 'Marseille', '13000', 'France');

-- Insert sample projects
INSERT INTO projects (id, name, description, status, client_id, site_address_street, site_address_city, site_address_postal_code, planned_start_date, planned_end_date, estimated_budget, tags, notes) VALUES
    ('550e8400-e29b-41d4-a716-446655440020', 'Rénovation Maison Dupont', 'Remplacement de toutes les fenêtres de la maison principale', 'in_progress', '550e8400-e29b-41d4-a716-446655440010', '12 Rue de la Paix', 'Paris', '75001', '2024-01-15', '2024-02-15', 15000.00, '{"rénovation", "fenêtres", "urgent"}', 'Client très pressé, prévoir livraison express'),
    ('550e8400-e29b-41d4-a716-446655440021', 'Nouveau Bâtiment Martin', 'Construction neuve - Fenêtres et portes complètes', 'draft', '550e8400-e29b-41d4-a716-446655440011', '45 Avenue des Champs', 'Lyon', '69000', '2024-03-01', '2024-05-30', 45000.00, '{"construction", "neuf", "commercial"}', 'Projet commercial importante - Respecter délais'),
    ('550e8400-e29b-41d4-a716-446655440022', 'Extension Moreau', 'Extension de maison avec nouvelles ouvertures', 'completed', '550e8400-e29b-41d4-a716-446655440012', '78 Boulevard Voltaire', 'Marseille', '13000', '2023-11-01', '2023-12-15', 8500.00, '{"extension", "terminé"}', 'Projet terminé avec satisfaction client');

-- Insert sample project products
INSERT INTO project_products (id, project_id, product_id, quantity, dimensions, parameters, status, notes, measurements) VALUES
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440005', 6, 
     '{"largeur": 1200, "hauteur": 1400}', 
     '{"materiau": "PVC", "couleur": "Blanc", "vitrage": "Double vitrage 4/16/4", "ouverture": "Oscillo-battant"}', 
     'validated', 'Fenêtres salon et chambres', 
     '{"largeur": 1200, "hauteur": 1400, "epaisseurMur": 200}'),
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440006', 2,
     '{"largeur": 900, "hauteur": 2100}',
     '{"materiau": "Aluminium", "couleur": "Gris anthracite", "options": ["Vitrage", "Serrure multipoints"]}',
     'draft', 'Portes d''entrée principale et secondaire', 
     '{}'),
    ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440005', 3,
     '{"largeur": 1000, "hauteur": 1200}',
     '{"materiau": "PVC", "couleur": "Blanc", "vitrage": "Double vitrage 4/16/4", "ouverture": "Battant"}',
     'ordered', 'Fenêtres extension - Projet terminé',
     '{"largeur": 1000, "hauteur": 1200, "epaisseurMur": 180}'); 