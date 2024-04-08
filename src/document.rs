use yrs::{updates::decoder::Decode, Doc, Map, MapRef, Transact, Update};

pub struct Document {
    root_doc: Doc,
    root_folder: MapRef,
}

impl Document {
    pub fn new() -> Self {
        let root_doc = Doc::new();
        let root_folder = root_doc.get_or_insert_map("root");

        Self {
            root_doc,
            root_folder,
        }
    }

    pub fn create_file(&mut self, name: &str) -> Result<(), String> {
        let mut txn = self.root_doc.transact_mut();

        if self.root_folder.contains_key(&mut txn, name) {
            return Err(format!("file with name {} already exists", name));
        }

        self.root_folder.insert(&mut txn, name, String::new());

        Ok(())
    }

    pub fn update(&mut self, update: Vec<u8>) {
        self.root_doc
            .transact_mut()
            .apply_update(Update::decode_v1(update.as_slice()).unwrap());
    }
}
